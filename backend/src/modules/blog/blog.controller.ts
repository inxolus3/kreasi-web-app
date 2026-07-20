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

const getImageUrl = (image: { id: number } | null | undefined): string | null => {
  if (!image) return null;
  return `/api/v1/images/${image.id}`;
};

const formatPost = (post: any) => ({
  ...post,
  thumbnailId: post.thumbnail?.id ?? null,
  galleryImageIds: Array.isArray(post.gallery)
    ? post.gallery.map((image: any) => image.id)
    : [],
  thumbnail: getImageUrl(post.thumbnail),
  gallery: Array.isArray(post.gallery)
    ? post.gallery
        .map((image: any) => getImageUrl(image))
        .filter((url: string | null) => url !== null)
    : [],
});

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postRepository.findAll(req.query);
    const formattedData = Array.isArray(posts.data) ? posts.data.map(formatPost) : [];
    res.json({ status: 'success', data: formattedData, meta: posts.meta });
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
    res.json({ status: 'success', data: formatPost(post) });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};

export const getPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postRepository.findBySlug(req.params.slug);
    if (!post) {
      res.status(404).json({ status: 'fail', message: 'Post not found' });
      return;
    }
    res.json({ status: 'success', data: formatPost(post) });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    const { thumbnailImageId, galleryImageIds, tagIds, categoryId, authorId: _authorId, ...payload } = req.body;
    const createData: any = {
      ...payload,
      author: { connect: { id: userId } },
      category: { connect: { id: categoryId } },
    };

    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      createData.tags = { connect: tagIds.map((id: number) => ({ id })) };
    }

    if (thumbnailImageId) {
      createData.thumbnail = { connect: { id: thumbnailImageId } };
    }

    if (galleryImageIds && Array.isArray(galleryImageIds) && galleryImageIds.length > 0) {
      createData.gallery = { connect: galleryImageIds.map((id: number) => ({ id })) };
    }

    const post = await postRepository.create(createData);
    res.status(201).json({ status: 'success', data: formatPost(post) });
  } catch (error) {
    if (!handleServiceError(error, res)) next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { thumbnailImageId, galleryImageIds, tagIds, categoryId, authorId: _authorId, ...payload } = req.body;
    const updateData: any = { ...payload };

    if (categoryId) {
      updateData.category = { connect: { id: categoryId } };
    }

    if (tagIds) {
      updateData.tags = { set: tagIds.map((id: number) => ({ id })) };
    }

    if (thumbnailImageId !== undefined) {
      updateData.thumbnail = thumbnailImageId
        ? { connect: { id: thumbnailImageId } }
        : { disconnect: true };
    }

    if (galleryImageIds) {
      updateData.gallery = { set: galleryImageIds.map((id: number) => ({ id })) };
    }

    const post = await postRepository.update(Number(req.params.id), updateData);
    res.json({ status: 'success', data: formatPost(post) });
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
