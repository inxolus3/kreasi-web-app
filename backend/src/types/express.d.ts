import type { JwtPayload } from '../utils/jwt.util';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      file?: import('multer').File;
      files?: import('multer').File[] | { [fieldname: string]: import('multer').File[] };
    }
  }
}

declare module 'archiver';
declare module 'swagger-jsdoc';
declare module '@aws-sdk/client-s3';
