import fs from 'fs/promises';
import path from 'path';
import * as archiverModule from 'archiver';
import { createWriteStream, existsSync } from 'fs';
import { logger } from '../src/utils/logger';

const archiver = (archiverModule as any).default || archiverModule;

export async function backupUploads() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = path.resolve(process.cwd(), './backups');
  const outputFile = path.join(outputDir, `uploads-${timestamp}.zip`);
  const uploadsDir = path.resolve(process.cwd(), './uploads');
  
  try {
    await fs.mkdir(outputDir, { recursive: true });
    
    if (!existsSync(uploadsDir)) {
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    logger.info('Starting uploads directory backup (zip)...');

    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = createWriteStream(outputFile);
    
    return new Promise<string>((resolve, reject) => {
      output.on('close', () => {
        logger.info(`Uploads backup created successfully: ${outputFile} (${archive.pointer()} total bytes)`);
        resolve(outputFile);
      });

      archive.on('error', (err: any) => {
        logger.error({ err }, 'Error during archiving uploads');
        reject(err);
      });

      archive.pipe(output);
      archive.directory(uploadsDir, false);
      archive.finalize();
    });
  } catch (error) {
    logger.error({ error }, 'Uploads backup failed');
    throw error;
  }
}

// Run if called directly
const isMain = process.argv[1] && (
  process.argv[1].endsWith('backup-uploads.ts') || 
  process.argv[1].endsWith('backup-uploads.js') || 
  process.argv[1].endsWith('backup-uploads')
);

if (isMain) {
  backupUploads()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
