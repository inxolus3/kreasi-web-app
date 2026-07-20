import { Prisma } from '@prisma/client';
import prisma from '../../utils/prisma';

export class PostRepository {
  async findAll(query: any) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, parseInt(query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.categoryId) {
      where.categoryId = parseInt(query.categoryId, 10);
    }
    if (query.tagId) {
      where.tags = {
        some: { id: parseInt(query.tagId, 10) }
      };
    }
    if (query.featured !== undefined) {
      where.featured = query.featured === 'true' || query.featured === true;
    }

    const [data, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          author: { select: { id: true, name: true, role: true } },
          thumbnail: true,
          gallery: true,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        thumbnail: true,
        gallery: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
        thumbnail: true,
        gallery: true,
      },
    });
  }

  async findMany(query: any) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, parseInt(query.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.categoryId) {
      where.categoryId = parseInt(query.categoryId, 10);
    }
    if (query.tagId) {
      where.tags = {
        some: { id: parseInt(query.tagId, 10) }
      };
    }
    if (query.featured !== undefined) {
      where.featured = query.featured === 'true' || query.featured === true;
    }

    return prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        author: { select: { id: true, name: true, role: true } },
        thumbnail: true,
        gallery: true,
      },
    });
  }

  async count(where?: Prisma.PostWhereInput) {
    return prisma.post.count({ where });
  }

  async create(data: Prisma.PostCreateInput) {
    return prisma.post.create({ data });
  }

  async update(id: number, data: Prisma.PostUpdateInput) {
    return prisma.post.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.post.delete({ where: { id } });
  }
}