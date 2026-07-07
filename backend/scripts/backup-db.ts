import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { logger } from '../src/utils/logger';
import { env } from '../src/config/env';

const execAsync = promisify(exec);

export async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${timestamp}.sql`;
  const backupsDir = path.resolve(process.cwd(), './backups');
  const filepath = path.join(backupsDir, filename);

  try {
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const { DATABASE_URL } = env;
    if (!DATABASE_URL) throw new Error('DATABASE_URL not set');

    logger.info('Starting database backup (pg_dump)...');
    await execAsync(`pg_dump "${DATABASE_URL}" > "${filepath}"`);
    logger.info(`Database backup created: ${filepath}`);

    // Upload to S3 if configured
    if (env.AWS_BUCKET_NAME && env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      logger.info(`Uploading backup ${filename} to AWS S3 bucket: ${env.AWS_BUCKET_NAME}...`);
      await uploadToS3(filepath, filename);
    }
    return filepath;
  } catch (error) {
    logger.error({ error }, 'Database backup failed');
    throw error;
  }
}

async function uploadToS3(filePath: string, fileName: string) {
  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    
    const clientConfig: any = {
      region: env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
      },
    };

    if (env.AWS_S3_ENDPOINT) {
      clientConfig.endpoint = env.AWS_S3_ENDPOINT;
      clientConfig.forcePathStyle = true;
    }

    const s3Client = new S3Client(clientConfig);
    const fileStream = fs.createReadStream(filePath);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: env.AWS_BUCKET_NAME!,
        Key: `db-backups/${fileName}`,
        Body: fileStream,
      })
    );

    logger.info(`Successfully uploaded database backup ${fileName} to S3.`);
  } catch (err) {
    logger.error({ err }, 'Uploading database backup to S3 failed');
  }
}

// Run if called directly
const isMain = process.argv[1] && (
  process.argv[1].endsWith('backup-db.ts') || 
  process.argv[1].endsWith('backup-db.js') || 
  process.argv[1].endsWith('backup-db')
);

if (isMain) {
  backupDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
