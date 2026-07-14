import { Router } from 'express';
import { validate } from '../../middlewares/validationHandler';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { auditLog } from '../../middlewares/audit.middleware';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from './blog.controller';
import {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema
} from './blog.validation';

const router = Router();

// Posts
router.post('/posts', authenticate, authorize(['ADMIN', 'USER']), validate(createPostSchema), auditLog('CREATE_POST'), createPost);
router.get('/posts', validate(getPostsQuerySchema), getPosts);
router.get('/posts/:id', getPost);
router.patch('/posts/:id', authenticate, authorize(['ADMIN', 'USER']), validate(updatePostSchema), auditLog('UPDATE_POST'), updatePost);
router.delete('/posts/:id', authenticate, authorize(['ADMIN', 'USER']), auditLog('DELETE_POST'), deletePost);

export default router;