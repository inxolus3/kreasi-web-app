import { Router } from 'express';
import { BillboardController } from './billboard.controller';
import { validate } from '../../middlewares/validationHandler';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { auditLog } from '../../middlewares/audit.middleware';
import { cacheMiddleware, invalidateCacheMiddleware } from '../../middlewares/cache.middleware';
import {
  createBillboardSchema,
  updateBillboardSchema,
  updateBillboardStatusSchema,
  getBillboardsQuerySchema,
} from './billboard.validation';

const router = Router();
const billboardController = new BillboardController();

// PUBLIC APIs
// GET /api/v1/public/billboards
router.get('/public/billboards', validate(getBillboardsQuerySchema), cacheMiddleware('billboards'), billboardController.getPublicBillboards);

// Additional filters APIs
router.get('/public/billboards/cities', billboardController.getPublicCities);
router.get('/public/billboards/types', billboardController.getPublicTypes);
router.get('/public/billboards/lightings', billboardController.getPublicLightings);

// GET /api/v1/public/billboards/:slug
router.get('/public/billboards/:slug', billboardController.getPublicBillboardBySlug);

// ADMIN APIs (Protected, Admin Only)
router.post(
  '/admin/billboards',
  authenticate,
  authorize(['ADMIN']),
  invalidateCacheMiddleware('billboards'),
  validate(createBillboardSchema),
  auditLog('CREATE_BILLBOARD'),
  billboardController.createBillboard
);

router.get(
  '/admin/billboards',
  authenticate,
  authorize(['ADMIN']),
  validate(getBillboardsQuerySchema),
  billboardController.getAdminBillboards
);

router.get(
  '/admin/billboards/:id',
  authenticate,
  authorize(['ADMIN']),
  billboardController.getAdminBillboardById
);

router.patch(
  '/admin/billboards/:id',
  authenticate,
  authorize(['ADMIN']),
  invalidateCacheMiddleware('billboards'),
  validate(updateBillboardSchema),
  auditLog('UPDATE_BILLBOARD'),
  billboardController.updateBillboard
);

router.patch(
  '/admin/billboards/:id/status',
  authenticate,
  authorize(['ADMIN']),
  invalidateCacheMiddleware('billboards'),
  validate(updateBillboardStatusSchema),
  auditLog('UPDATE_BILLBOARD_STATUS'),
  billboardController.updateBillboardStatus
);

router.delete(
  '/admin/billboards/:id',
  authenticate,
  authorize(['ADMIN']),
  invalidateCacheMiddleware('billboards'),
  auditLog('DELETE_BILLBOARD'),
  billboardController.deleteBillboard
);

// File upload endpoints (Protected, Admin Only)
router.post(
  '/admin/billboards/upload/thumbnail',
  authenticate,
  authorize(['ADMIN']),
  upload.single('thumbnail'),
  auditLog('UPLOAD_BILLBOARD_THUMBNAIL'),
  billboardController.uploadThumbnail
);

router.post(
  '/admin/billboards/upload/gallery',
  authenticate,
  authorize(['ADMIN']),
  upload.array('gallery', 10),
  auditLog('UPLOAD_BILLBOARD_GALLERY'),
  billboardController.uploadGallery
);

export default router;
