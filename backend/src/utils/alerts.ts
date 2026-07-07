import { logger } from './logger';
import { env } from '../config/env';

export function alertCritical(message: string, meta?: object) {
  logger.fatal({ alert: 'CRITICAL', ...meta }, message);
  
  // Send to Slack/Discord webhook in production
  if (env.NODE_ENV === 'production' && env.ALERT_WEBHOOK) {
    fetch(env.ALERT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 CRITICAL: ${message}`,
        attachments: [
          {
            text: meta ? JSON.stringify(meta, null, 2) : '',
          },
        ],
      }),
    }).catch((err) => {
      logger.error({ err }, 'Failed to send critical alert webhook');
    });
  }
}

export function alertWarning(message: string, meta?: object) {
  logger.warn({ alert: 'WARNING', ...meta }, message);
}
