import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { PostRepository } from './post.repository';

const postRepository = new PostRepository();

const handleServiceError = (error: unknown, res: Response): boolean => {
  if (error instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ status: 'fail', message: 'Validation Error', errors: error.message });
    return true;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(400).json({ status: 'fail', message: 'Slug already exists' });
        return true;
      case 'P2025':
        res.status(404).json({ status: 'fail', message: 'Post not found' });
        return true;
    }
  }
  if (error instanceof Error) {
    res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
    return true;
  }
  return false;
};

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postRepository.findAll(req.query);
    res.json({ status: 'success', data: posts });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};

export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postRepository.findById(Number(req.params.id));
    if (!post) {
      res.status(404).json({ status: 'fail', message: 'Post not found' });
      return;
    }
    res.json({ status: 'success', data: post });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }
    const post = await postRepository.create({ ...req.body, authorId: userId });
    res.status(201).json({ status: 'success', data: post });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postRepository.update(Number(req.params.id), req.body);
    res.json({ status: 'success', data: post });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await postRepository.delete(Number(req.params.id));
    res.json({ status: 'success', message: 'Post deleted successfully' });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};