import { PostRepository } from './post.repository';
import { Prisma } from '@prisma/client';

export class PostService {
  private postRepository: PostRepository;

  constructor() {
    this.postRepository = new PostRepository();
  }

  async createPost(authorId: number, data: any) {
    const existing = await this.postRepository.findBySlug(data.slug);
    if (existing) throw new Error('Post with this slug already exists');

    const { tagIds, thumbnailImageId, galleryImageIds, categoryId, ...postData } = data;
    const createData: Prisma.PostCreateInput = {
      ...postData,
      author: { connect: { id: authorId } },
      category: { connect: { id: categoryId } },
    };

    if (thumbnailImageId) {
      createData.thumbnail = { connect: { id: thumbnailImageId } };
    }

    if (galleryImageIds && galleryImageIds.length > 0) {
      createData.gallery = {
        connect: galleryImageIds.map((id: number) => ({ id })),
      };
    }

    if (tagIds && tagIds.length > 0) {
      createData.tags = {
        connect: tagIds.map((id: number) => ({ id }))
      };
    }

    return this.postRepository.create(createData);
  }

  async getPosts(query: any) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;
    
    const where: Prisma.PostWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    
    if (query.categoryId) {
      where.categoryId = parseInt(query.categoryId, 10);
    }

    if (query.tagId) {
      where.tags = {
        some: { id: parseInt(query.tagId, 10) }
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.featured !== undefined) {
      where.featured = query.featured === 'true';
    }

    const [posts, total] = await Promise.all([
      this.postRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' }
      }),
      this.postRepository.count(where)
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPostById(id: number) {
    const post = await this.postRepository.findById(id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async getPostBySlug(slug: string) {
    const post = await this.postRepository.findBySlug(slug);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async updatePost(id: number, data: any) {
    if (data.slug) {
      const existing = await this.postRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        throw new Error('Post with this slug already exists');
      }
    }

    const { tagIds, categoryId, thumbnailImageId, galleryImageIds, ...updateData } = data;
    const updateInput: Prisma.PostUpdateInput = { ...updateData };

    if (categoryId) {
      updateInput.category = { connect: { id: categoryId } };
    }

    if (thumbnailImageId !== undefined) {
      updateInput.thumbnail = thumbnailImageId
        ? { connect: { id: thumbnailImageId } }
        : { disconnect: true };
    }

    if (galleryImageIds) {
      updateInput.gallery = {
        set: galleryImageIds.map((tid: number) => ({ id: tid }))
      };
    }

    if (tagIds) {
      updateInput.tags = {
        set: tagIds.map((tid: number) => ({ id: tid }))
      };
    }

    return this.postRepository.update(id, updateInput);
  }

  async deletePost(id: number) {
    return this.postRepository.delete(id);
  }
}
