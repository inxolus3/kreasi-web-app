import { Router } from 'express';
import { validate } from '../../middlewares/validationHandler';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/role.middleware';
import { auditLog } from '../../middlewares/audit.middleware';
import {
  getPosts,
  getPost,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from './blog.controller';
import {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema,
  idParamSchema, // ← tambahkan ini di blog.validation.ts
} from './blog.validation';

const router = Router();

router.post(
  '/posts',
  authenticate,
  authorize(['ADMIN', 'USER']),
  validate(createPostSchema),
  auditLog('CREATE_POST'),
  createPost
);

router.get(
  '/posts',
  validate(getPostsQuerySchema),
  getPosts
);

router.get(
  '/posts/slug/:slug',
  getPostBySlug
);

router.get(
  '/posts/:id',
  validate(idParamSchema),
  getPost
);

router.patch(
  '/posts/:id',
  authenticate,
  authorize(['ADMIN', 'USER']),
  validate(idParamSchema),
  validate(updatePostSchema),
  auditLog('UPDATE_POST'),
  updatePost
);

router.delete(
  '/posts/:id',
  authenticate,
  authorize(['ADMIN', 'USER']),
  validate(idParamSchema),
  auditLog('DELETE_POST'),
  deletePost
);

export default router;
