import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../config/env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadsDir = (): string => {
  try {
    const filename = fileURLToPath(import.meta.url);
    const dirname = path.dirname(filename);
    
    // Check if package.json exists at ../package.json (bundled /dist/server.js)
    if (fs.existsSync(path.join(dirname, '../package.json'))) {
      return path.resolve(dirname, '../uploads');
    }
    
    // Check if package.json exists at ../../../package.json (dev src/modules/upload)
    if (fs.existsSync(path.join(dirname, '../../../package.json'))) {
      return path.resolve(dirname, '../../../uploads');
    }

    if (dirname.endsWith('dist')) {
      return path.resolve(dirname, '../uploads');
    }
    return path.resolve(dirname, '../../../uploads');
  } catch {
    if (fs.existsSync(path.resolve(process.cwd(), 'backend'))) {
      return path.resolve(process.cwd(), 'backend/uploads');
    }
    return path.resolve(process.cwd(), 'uploads');
  }
};

export interface IStorageProvider {
  uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string, folder: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<void>;
}

/**
 * Local Storage Provider
 * Saves files locally to /backend/uploads/{folder}
 */
export class LocalStorageProvider implements IStorageProvider {
  private baseUploadDir: string;

  constructor() {
    this.baseUploadDir = getUploadsDir();
    if (!fs.existsSync(this.baseUploadDir)) {
      fs.mkdirSync(this.baseUploadDir, { recursive: true });
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string
  ): Promise<{ url: string; key: string }> {
    const targetDir = path.join(this.baseUploadDir, folder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetPath = path.join(targetDir, fileName);
    await fs.promises.writeFile(targetPath, fileBuffer);

    const relativePath = `uploads/${folder}/${fileName}`;
    
    // For local storage, the key is the relative path from the uploads root
    const key = `${folder}/${fileName}`;
    const baseUrl = env.NODE_ENV === 'production' ? process.env.APP_URL || 'http://localhost:3000' : 'http://localhost:3000';
    const url = `${baseUrl}/${relativePath}`;

    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    const targetPath = path.join(this.baseUploadDir, key);
    if (fs.existsSync(targetPath)) {
      await fs.promises.unlink(targetPath);
    }
  }
}

/**
 * S3 Storage Provider
 * Future production-ready implementation utilizing AWS SDK S3Client
 */
export class S3StorageProvider implements IStorageProvider {
  protected bucketName: string;
  protected region: string;
  protected clientPromise: Promise<any> | null = null;
  protected s3Client: any = null;

  constructor() {
    this.bucketName = env.AWS_BUCKET_NAME || '';
    this.region = env.AWS_REGION || 'us-east-1';

    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !this.bucketName) {
      // Don't throw immediately on constructor load so that server starts smoothly
      console.warn('⚠️ AWS credentials or S3 Bucket Name are not fully configured. S3 upload will fail if invoked.');
    }
  }

  protected async getClient(): Promise<any> {
    if (this.s3Client) return this.s3Client;
    if (this.clientPromise) return this.clientPromise;

    this.clientPromise = (async () => {
      try {
        // Dynamic import to prevent bundler errors if package is missing
        const { S3Client } = await import('@aws-sdk/client-s3');
        
        const clientConfig: any = {
          region: this.region,
          credentials: {
            accessKeyId: env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
          },
        };

        if (env.AWS_S3_ENDPOINT) {
          clientConfig.endpoint = env.AWS_S3_ENDPOINT;
          clientConfig.forcePathStyle = true; // Often required for custom endpoints like MinIO/R2
        }

        this.s3Client = new S3Client(clientConfig);
        return this.s3Client;
      } catch (_err: any) {
        throw new Error(
          'Failed to load @aws-sdk/client-s3. Please install it with "npm install @aws-sdk/client-s3" to use S3/R2 storage.'
        );
      }
    })();

    return this.clientPromise;
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string
  ): Promise<{ url: string; key: string }> {
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !this.bucketName) {
      throw new Error('S3 credentials are missing in your environment configuration.');
    }

    const s3 = await this.getClient();
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');

    const key = `${folder}/${fileName}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      })
    );

    const url = env.AWS_S3_ENDPOINT
      ? `${env.AWS_S3_ENDPOINT.replace(/\/$/, '')}/${this.bucketName}/${key}`
      : `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !this.bucketName) {
      throw new Error('S3 credentials are missing in your environment configuration.');
    }

    const s3 = await this.getClient();
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');

    await s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      })
    );
  }
}

/**
 * Cloudflare R2 Storage Provider
 * Built on S3 client but with Cloudflare endpoint specifications
 */
export class R2StorageProvider extends S3StorageProvider {
  constructor() {
    super();
    if (!env.AWS_S3_ENDPOINT) {
      console.warn('⚠️ Cloudflare R2 endpoint (AWS_S3_ENDPOINT) is not configured. R2 will default to standard AWS S3 endpoint.');
    }
  }

  override async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string
  ): Promise<{ url: string; key: string }> {
    const result = await super.uploadFile(fileBuffer, fileName, mimeType, folder);
    
    // R2 public URL format custom tailoring if a public domain/url is configured
    // For general compatibility, we can keep S3 client response or adjust based on endpoint.
    return result;
  }
}

/**
 * Factory function to retrieve current active Storage Provider
 */
export function getStorageProvider(): IStorageProvider {
  const provider = env.STORAGE_PROVIDER;
  switch (provider) {
    case 's3':
      return new S3StorageProvider();
    case 'r2':
      return new R2StorageProvider();
    case 'local':
    default:
      return new LocalStorageProvider();
  }
}
