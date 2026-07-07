import cron from 'node-cron';
import { backupDatabase } from './backup-db';
import { backupUploads } from './backup-uploads';
import { logger } from '../src/utils/logger';

export function scheduleBackups() {
  // Daily backup at 2 AM
  cron.schedule('0 2 * * *', async () => {
    logger.info('Starting scheduled backup (daily 2 AM)...');
    try {
      await backupDatabase();
      await backupUploads();
      logger.info('Scheduled backup completed successfully.');
    } catch (error) {
      logger.error({ error }, 'Scheduled backup failed.');
    }
  });

  logger.info('Backup cron job scheduled (daily 2 AM).');
}

// Run if called directly
const isMain = process.argv[1] && (
  process.argv[1].endsWith('cron-backup.ts') || 
  process.argv[1].endsWith('cron-backup.js') || 
  process.argv[1].endsWith('cron-backup')
);

if (isMain) {
  scheduleBackups();
}
