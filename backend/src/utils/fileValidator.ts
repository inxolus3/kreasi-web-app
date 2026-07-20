import sharp from 'sharp';
import { logger } from './logger';

export async function validateImageFile(
  filePathOrBuffer: string | Buffer,
  mimeType?: string
): Promise<boolean> {
  try {
    const metadata = await sharp(filePathOrBuffer).metadata();
    const allowedFormats = ['jpeg', 'png', 'webp', 'gif'];
    const normalizedFormat = metadata.format?.toLowerCase();

    if (normalizedFormat && allowedFormats.includes(normalizedFormat)) {
      return true;
    }

    if (mimeType) {
      const normalizedMimeType = mimeType.toLowerCase();
      if (
        normalizedMimeType === 'image/jpeg' ||
        normalizedMimeType === 'image/jpg' ||
        normalizedMimeType === 'image/png' ||
        normalizedMimeType === 'image/webp' ||
        normalizedMimeType === 'image/gif'
      ) {
        return true;
      }
    }

    logger.warn({ format: metadata.format, mimeType }, 'File failed real MIME type validation via sharp');
    return false;
  } catch (err: any) {
    logger.error({ error: err.message }, 'Failed to validate image content via sharp');
    return false;
  }
}
