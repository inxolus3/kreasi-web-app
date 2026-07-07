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
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });
  }

  async count(where?: Prisma.PostWhereInput): Promise<number> {
    return prisma.post.count({ where });
  }

  async findById(id: number): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });
  }

  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return prisma.post.update({
      where: { id },
      data,
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });
  }

  async delete(id: number): Promise<Post> {
    return prisma.post.delete({ where: { id } });
  }
}
