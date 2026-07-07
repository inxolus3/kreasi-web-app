import { Router } from 'express';
import dns from 'dns';
import net from 'net';
import prisma from '../utils/prisma';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const router = Router();

// Helper to mask sensitive database URL details
function maskConnectionString(urlStr: string): string {
  try {
    const parsed = new URL(urlStr);
    if (parsed.password) {
      parsed.password = '********';
    }
    return parsed.toString();
  } catch {
    // Regex mask fallback
    return urlStr.replace(/(:\/\/)([^:]+):([^@]+)(@)/, '$1$2:********$4');
  }
}

// Helper to parse database URL securely
function parseDatabaseUrl(dbUrl: string) {
  try {
    const parsed = new URL(dbUrl);
    return {
      protocol: parsed.protocol,
      host: parsed.hostname,
      port: parsed.port || '5432',
      database: parsed.pathname.slice(1),
      username: parsed.username,
      sslmode: parsed.searchParams.get('sslmode') || 'not specified',
    };
  } catch {
    // Basic regex fallback
    const match = dbUrl.match(/^(postgresql|postgres):\/\/([^:]+):([^@]+)@([^:/]+)(?::(\d+))?\/([^?]+)?/);
    if (match) {
      return {
        protocol: match[1] + ':',
        host: match[4],
        port: match[5] || '5432',
        database: match[6] || '',
        username: match[2],
        sslmode: 'regex parsed (no params)',
      };
    }
    return null;
  }
}

// Helper for DNS lookup test
async function testDns(host: string): Promise<{ resolved: boolean; ips?: string[]; error?: string }> {
  try {
    const addresses = await dns.promises.resolve(host).catch(async () => {
      // Fallback to standard lookup
      const result = await dns.promises.lookup(host);
      return [result.address];
    });
    return { resolved: true, ips: addresses };
  } catch (err: any) {
    return { resolved: false, error: err.message };
  }
}

// Helper for TCP connection test
async function testTcp(host: string, port: number): Promise<{ connected: boolean; error?: string; durationMs?: number }> {
  const start = Date.now();
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    socket.setTimeout(3000); // 3 seconds timeout

    socket.connect(port, host, () => {
      socket.destroy();
      if (!isResolved) {
        isResolved = true;
        resolve({ connected: true, durationMs: Date.now() - start });
      }
    });

    socket.on('error', (err) => {
      socket.destroy();
      if (!isResolved) {
        isResolved = true;
        resolve({ connected: false, error: err.message, durationMs: Date.now() - start });
      }
    });

    socket.on('timeout', () => {
      socket.destroy();
      if (!isResolved) {
        isResolved = true;
        resolve({ connected: false, error: 'Connection timeout after 3s', durationMs: Date.now() - start });
      }
    });
  });
}

router.get('/', async (_req, res) => {
  logger.info('Running database diagnostic checks...');
  
  const rawDbUrl = env.DATABASE_URL || '';
  const maskedUrl = maskConnectionString(rawDbUrl);
  const dbInfo = parseDatabaseUrl(rawDbUrl);

  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database_config: {
      url_configured: !!rawDbUrl,
      masked_url: maskedUrl,
      parsed: dbInfo ? {
        protocol: dbInfo.protocol,
        host: dbInfo.host,
        port: dbInfo.port,
        database: dbInfo.database,
        username: dbInfo.username,
        sslmode: dbInfo.sslmode,
      } : null,
    },
    checks: {
      dns: { status: 'pending' },
      tcp: { status: 'pending' },
      prisma_connection: { status: 'pending' },
    },
    overall_status: 'unknown',
  };

  // If DB URL is missing or invalid, fail early
  if (!rawDbUrl || !dbInfo) {
    diagnostics.overall_status = 'failed';
    const errMsg = !rawDbUrl ? 'DATABASE_URL is not configured' : 'DATABASE_URL format is invalid';
    diagnostics.error = errMsg;
    logger.error({ error: errMsg }, 'Database diagnostics failed - missing/invalid URL');
    return res.status(500).json(diagnostics);
  }

  // 1. DNS Resolution Test
  const dnsResult = await testDns(dbInfo.host);
  if (dnsResult.resolved) {
    diagnostics.checks.dns = {
      status: 'success',
      resolved_ips: dnsResult.ips,
    };
  } else {
    diagnostics.checks.dns = {
      status: 'failed',
      error: dnsResult.error,
    };
    logger.warn({ host: dbInfo.host, error: dnsResult.error }, 'DNS check failed');
  }

  // 2. TCP Port Test
  const portNum = parseInt(dbInfo.port, 10);
  const tcpResult = await testTcp(dbInfo.host, portNum);
  if (tcpResult.connected) {
    diagnostics.checks.tcp = {
      status: 'success',
      duration_ms: tcpResult.durationMs,
    };
  } else {
    diagnostics.checks.tcp = {
      status: 'failed',
      error: tcpResult.error,
      duration_ms: tcpResult.durationMs,
    };
    logger.warn({ host: dbInfo.host, port: portNum, error: tcpResult.error }, 'TCP check failed');
  }

  // 3. Prisma Connection / Query Test
  const prismaStart = Date.now();
  try {
    // Attempt a basic low-overhead check
    await prisma.$queryRaw`SELECT 1`;
    const duration = Date.now() - prismaStart;
    
    diagnostics.checks.prisma_connection = {
      status: 'success',
      duration_ms: duration,
    };
    diagnostics.overall_status = 'healthy';
    logger.info('Prisma connection test succeeded');
  } catch (err: any) {
    const duration = Date.now() - prismaStart;
    
    // Analyze Prisma specific errors
    const errorDetails = {
      message: err.message || 'Unknown error',
      code: err.code || null, // e.g., Prisma error codes like P1001, P1002
      meta: err.meta || null,
      clientVersion: err.clientVersion || null,
    };

    diagnostics.checks.prisma_connection = {
      status: 'failed',
      error: errorDetails,
      duration_ms: duration,
    };
    diagnostics.overall_status = 'degraded';
    
    logger.error(
      { prisma_error: errorDetails },
      'Prisma query execution failed during diagnostics'
    );
  }

  // Set response status code based on health
  const statusCode = diagnostics.overall_status === 'healthy' ? 200 : 500;
  return res.status(statusCode).json(diagnostics);
});

export default router;
