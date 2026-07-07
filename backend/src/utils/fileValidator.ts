import sharp from 'sharp';
import { logger } from './logger';

export async function validateImageFile(filePathOrBuffer: string | Buffer): Promise<boolean> {
  try {
    const metadata = await sharp(filePathOrBuffer).metadata();
    const allowedFormats = ['jpeg', 'png', 'webp', 'gif'];
    if (metadata.format && allowedFormats.includes(metadata.format.toLowerCase())) {
      return true;
    }
    logger.warn({ format: metadata.format }, 'File failed real MIME type validation via sharp');
    return false;
  } catch (err: any) {
    logger.error({ error: err.message }, 'Failed to validate image content via sharp');
    return false;
  }
}
