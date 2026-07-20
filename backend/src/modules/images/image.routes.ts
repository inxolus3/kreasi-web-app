import { Router } from 'express';
import { ImageController } from './image.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { memoryUpload } from '../../middlewares/upload.middleware';

const router = Router();
const imageController = new ImageController();

router.post(
  '/single',
  authenticate,
  memoryUpload.single('file'),
  imageController.uploadImage
);

router.post(
  '/multiple',
  authenticate,
  memoryUpload.array('files', 10),
  imageController.uploadMultipleImages
);

router.get('/:id', imageController.serveImage);

export default router;
