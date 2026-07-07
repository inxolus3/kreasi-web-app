import { Router } from 'express';
import { BlogController } from './blog.controller';
import { validate } from '../../middlewares/validationHandler';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { auditLog } from '../../middlewares/audit.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
  createTagSchema,
  updateTagSchema,
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema
} from './blog.validation';

const router = Router();
const blogController = new BlogController();

// Categories
router.post('/categories', authenticate, authorize(['ADMIN']), validate(createCategorySchema), auditLog('CREATE_CATEGORY'), blogController.createCategory);
router.get('/categories', blogController.getCategories);
router.get('/categories/:id', blogController.getCategory);
router.patch('/categories/:id', authenticate, authorize(['ADMIN']), validate(updateCategorySchema), auditLog('UPDATE_CATEGORY'), blogController.updateCategory);
router.delete('/categories/:id', authenticate, authorize(['ADMIN']), auditLog('DELETE_CATEGORY'), blogController.deleteCategory);

// Tags
router.post('/tags', authenticate, authorize(['ADMIN']), validate(createTagSchema), auditLog('CREATE_TAG'), blogController.createTag);
router.get('/tags', blogController.getTags);
router.get('/tags/:id', blogController.getTag);
router.patch('/tags/:id', authenticate, authorize(['ADMIN']), validate(updateTagSchema), auditLog('UPDATE_TAG'), blogController.updateTag);
router.delete('/tags/:id', authenticate, authorize(['ADMIN']), auditLog('DELETE_TAG'), blogController.deleteTag);

// Posts
router.post('/posts', authenticate, authorize(['ADMIN', 'USER']), validate(createPostSchema), auditLog('CREATE_POST'), blogController.createPost);
router.get('/posts', validate(getPostsQuerySchema), blogController.getPosts);
router.get('/posts/slug/:slug', blogController.getPostBySlug);
router.get('/posts/:id', blogController.getPost);
router.patch('/posts/:id', authenticate, authorize(['ADMIN', 'USER']), validate(updatePostSchema), auditLog('UPDATE_POST'), blogController.updatePost);
router.delete('/posts/:id', authenticate, authorize(['ADMIN', 'USER']), auditLog('DELETE_POST'), blogController.deletePost);

export default router;
