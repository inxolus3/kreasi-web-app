import { Router } from 'express';
import { UploadController } from './upload.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { memoryUpload } from '../../middlewares/upload.middleware';

const router = Router();
const uploadController = new UploadController();

// All upload routes are protected by JWT authentication
router.post(
  '/upload/single',
  authenticate,
  memoryUpload.single('file'),
  uploadController.uploadSingleFile
);

router.post(
  '/upload/multiple',
  authenticate,
  memoryUpload.array('files', 10),
  uploadController.uploadMultipleFiles
);

router.delete(
  '/upload',
  authenticate,
  uploadController.deleteFile
);

export default router;
