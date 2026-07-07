import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import { TagService } from './tag.service';
import { PostService } from './post.service';

export class BlogController {
  private categoryService = new CategoryService();
  private tagService = new TagService();
  private postService = new PostService();

  // CATEGORY
  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json({ status: 'success', data: category });
    } catch (error: any) {
      if (error.message === 'Category with this slug already exists') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json({ status: 'success', data: categories });
    } catch (error) {
      next(error);
    }
  };

  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(parseInt(req.params.id, 10));
      res.status(200).json({ status: 'success', data: category });
    } catch (error: any) {
      if (error.message === 'Category not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.updateCategory(parseInt(req.params.id, 10), req.body);
      res.status(200).json({ status: 'success', data: category });
    } catch (error: any) {
      if (error.message === 'Category with this slug already exists') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.categoryService.deleteCategory(parseInt(req.params.id, 10));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // TAG
  createTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag = await this.tagService.createTag(req.body);
      res.status(201).json({ status: 'success', data: tag });
    } catch (error: any) {
      if (error.message === 'Tag with this slug already exists') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  getTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await this.tagService.getAllTags();
      res.status(200).json({ status: 'success', data: tags });
    } catch (error) {
      next(error);
    }
  };

  getTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag = await this.tagService.getTagById(parseInt(req.params.id, 10));
      res.status(200).json({ status: 'success', data: tag });
    } catch (error: any) {
      if (error.message === 'Tag not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  updateTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tag = await this.tagService.updateTag(parseInt(req.params.id, 10), req.body);
      res.status(200).json({ status: 'success', data: tag });
    } catch (error: any) {
      if (error.message === 'Tag with this slug already exists') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  deleteTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.tagService.deleteTag(parseInt(req.params.id, 10));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // POST
  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'fail', message: 'Unauthorized' });
        return;
      }
      const post = await this.postService.createPost(req.user.userId, req.body);
      res.status(201).json({ status: 'success', data: post });
    } catch (error: any) {
      if (error.message === 'Post with this slug already exists') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.postService.getPosts(req.query);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getPostById(parseInt(req.params.id, 10));
      res.status(200).json({ status: 'success', data: post });
    } catch (error: any) {
      if (error.message === 'Post not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  getPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.getPostBySlug(req.params.slug);
      res.status(200).json({ status: 'success', data: post });
    } catch (error: any) {
      if (error.message === 'Post not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.updatePost(parseInt(req.params.id, 10), req.body);
      res.status(200).json({ status: 'success', data: post });
    } catch (error: any) {
      if (error.message === 'Post with this slug already exists') {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.postService.deletePost(parseInt(req.params.id, 10));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
