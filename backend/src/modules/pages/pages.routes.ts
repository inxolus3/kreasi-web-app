import { Router } from 'express';
import { PagesController } from './pages.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validationHandler';
import { auditLog } from '../../middlewares/audit.middleware';
import { cacheMiddleware, invalidateCacheMiddleware } from '../../middlewares/cache.middleware';
import {
  createPageSchema,
  updatePageSchema,
  saveBuilderSchema,
  updateThemeSettingSchema,
  createGlobalComponentSchema,
  updateGlobalComponentSchema,
  getPagesQuerySchema
} from './pages.validation';

const router = Router();
const controller = new PagesController();

// Page templates list (public-accessible for builder selection)
router.get('/pages/templates', controller.getTemplates);
router.get('/pages/templates/:id', controller.getTemplate);

// Global theme settings
router.get('/pages/theme-settings', controller.getThemeSettings);
router.put('/pages/theme-settings', authenticate, authorize(['ADMIN']), validate(updateThemeSettingSchema), auditLog('UPDATE_THEME_SETTING'), controller.updateThemeSetting);

// Global components
router.get('/pages/global-components', controller.getGlobalComponents);
router.post('/pages/global-components', authenticate, authorize(['ADMIN']), validate(createGlobalComponentSchema), auditLog('CREATE_GLOBAL_COMPONENT'), controller.createGlobalComponent);
router.patch('/pages/global-components/:id', authenticate, authorize(['ADMIN']), validate(updateGlobalComponentSchema), auditLog('UPDATE_GLOBAL_COMPONENT'), controller.updateGlobalComponent);
router.delete('/pages/global-components/:id', authenticate, authorize(['ADMIN']), auditLog('DELETE_GLOBAL_COMPONENT'), controller.deleteGlobalComponent);

// Public-accessible page rendering by slug
router.get('/pages/slug/:slug', cacheMiddleware('pages'), controller.getPageBySlug);

// Pages CRUD
router.get('/pages', validate(getPagesQuerySchema), cacheMiddleware('pages'), controller.getPages);
router.get('/pages/:id', controller.getPage);
router.post('/pages', authenticate, authorize(['ADMIN', 'USER']), invalidateCacheMiddleware('pages'), validate(createPageSchema), auditLog('CREATE_PAGE'), controller.createPage);
router.patch('/pages/:id', authenticate, authorize(['ADMIN', 'USER']), invalidateCacheMiddleware('pages'), validate(updatePageSchema), auditLog('UPDATE_PAGE'), controller.updatePage);
router.delete('/pages/:id', authenticate, authorize(['ADMIN']), invalidateCacheMiddleware('pages'), auditLog('DELETE_PAGE'), controller.deletePage);

// Page Builder Specifics
router.post('/pages/:id/builder', authenticate, authorize(['ADMIN', 'USER']), invalidateCacheMiddleware('pages'), validate(saveBuilderSchema), auditLog('SAVE_PAGE_BUILDER'), controller.saveBuilder);
router.post('/pages/:id/publish', authenticate, authorize(['ADMIN', 'USER']), invalidateCacheMiddleware('pages'), auditLog('PUBLISH_PAGE'), controller.publishPage);
router.post('/pages/:id/autosave', authenticate, authorize(['ADMIN', 'USER']), invalidateCacheMiddleware('pages'), validate(saveBuilderSchema), auditLog('AUTOSAVE_PAGE'), controller.autosave);
router.get('/pages/:id/versions', authenticate, authorize(['ADMIN', 'USER']), controller.getVersions);
router.post('/pages/:id/versions/:versionId/restore', authenticate, authorize(['ADMIN', 'USER']), invalidateCacheMiddleware('pages'), auditLog('RESTORE_PAGE_VERSION'), controller.restoreVersion);

export default router;
