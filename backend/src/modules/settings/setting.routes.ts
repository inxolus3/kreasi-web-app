import { Router } from 'express';
import { SettingController } from './setting.controller';
import { validate } from '../../middlewares/validationHandler';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { auditLog } from '../../middlewares/audit.middleware';
import { updateSettingsSchema } from './setting.validation';
import { cacheMiddleware, invalidateCacheMiddleware } from '../../middlewares/cache.middleware';

const router = Router();
const settingController = new SettingController();

// PUBLIC APIs
// GET /api/v1/public/settings
router.get('/public/settings', cacheMiddleware('settings'), settingController.getSettings);

// GET /api/v1/public/settings/:group
router.get('/public/settings/:group', cacheMiddleware('settings'), settingController.getSettingsByGroup);

// ADMIN APIs (Protected, Admin Only)
// PATCH /api/v1/admin/settings
router.patch(
  '/admin/settings',
  authenticate,
  authorize(['ADMIN']),
  invalidateCacheMiddleware('settings'),
  validate(updateSettingsSchema),
  auditLog('UPDATE_SETTINGS'),
  settingController.updateSettings
);

export default router;
