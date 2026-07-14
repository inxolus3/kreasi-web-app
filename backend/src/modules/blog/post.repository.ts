import prisma from '../../utils/prisma';
import { Prisma } from '@prisma/client';

export class PostRepository {
  async create(data: any): Promise<any> {
    // Transform flat IDs ke Prisma relation format
    const { authorId, categoryId, ...rest } = data;
    
    const createData: Prisma.PostCreateInput = {
      ...rest,
      author: { connect: { id: authorId } },
      category: categoryId ? { connect: { id: categoryId } } : undefined,
    };

    return prisma.post.create({
      data: createData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });
  }

  async update(id: number, data: any): Promise<any> {
    const { authorId, categoryId, ...rest } = data;
    
    const updateData: Prisma.PostUpdateInput = {
      ...rest,
      author: authorId ? { connect: { id: authorId } } : undefined,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
    };

    return prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });
  }

  async findAll(query: any = {}): Promise<any[]> {
    return prisma.post.findMany({
      where: query,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<any | null> {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });
  }

  async delete(id: number): Promise<any> {
    return prisma.post.delete({
      where: { id },
    });
  }
}