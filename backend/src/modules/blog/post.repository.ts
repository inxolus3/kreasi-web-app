import prisma from '../../utils/prisma';
import { Prisma, Post } from '@prisma/client';

export class PostRepository {
  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return prisma.post.create({ 
      data,
      include: { author: { select: { id: true, name: true, email: true } }, category: true, tags: true }
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PostWhereInput;
    orderBy?: Prisma.PostOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.post.findMany({
      skip,
      take,
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        slug: true,
        thumbnail: true,
        metaTitle: true,
        metaDescription: true,
        status: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async count(where?: Prisma.PostWhereInput): Promise<number> {
    return prisma.post.count({ where });
  }

  async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        gallery: true,
        metaTitle: true,
        metaDescription: true,
        status: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        gallery: true,
        metaTitle: true,
        metaDescription: true,
        status: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        thumbnail: true,
        gallery: true,
        metaTitle: true,
        metaDescription: true,
        status: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async delete(id: number): Promise<Post> {
    return prisma.post.delete({ where: { id } });
  }
}
