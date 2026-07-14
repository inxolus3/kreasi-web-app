import { Request, Response, NextFunction } from 'express';
import { PostRepository } from './post.repository';

const postRepository = new PostRepository();

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postRepository.findAll(req.query);
    res.json({ status: 'success', data: posts });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Failed to fetch posts' 
    });
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
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Failed to fetch post' 
    });
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postRepository.create(req.body);
    res.status(201).json({ status: 'success', data: post });
  } catch (error: any) {
    // Handle Prisma validation errors
    if (error.name === 'PrismaClientValidationError') {
      res.status(400).json({ 
        status: 'fail', 
        message: 'Validation Error',
        errors: error.message 
      });
      return;
    }
    
    // Handle Prisma known request errors
    if (error.code === 'P2002') {
      res.status(400).json({ 
        status: 'fail', 
        message: 'Slug already exists. Please use a different title.' 
      });
      return;
    }

    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Failed to create post' 
    });
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postRepository.update(Number(req.params.id), req.body);
    res.json({ status: 'success', data: post });
  } catch (error: any) {
    if (error.name === 'PrismaClientValidationError') {
      res.status(400).json({ 
        status: 'fail', 
        message: 'Validation Error',
        errors: error.message 
      });
      return;
    }

    if (error.code === 'P2002') {
      res.status(400).json({ 
        status: 'fail', 
        message: 'Slug already exists. Please use a different title.' 
      });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({ 
        status: 'fail', 
        message: 'Post not found' 
      });
      return;
    }

    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Failed to update post' 
    });
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await postRepository.delete(Number(req.params.id));
    res.json({ status: 'success', message: 'Post deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ 
        status: 'fail', 
        message: 'Post not found' 
      });
      return;
    }

    res.status(500).json({ 
      status: 'error', 
      message: error.message || 'Failed to delete post' 
    });
  }
};