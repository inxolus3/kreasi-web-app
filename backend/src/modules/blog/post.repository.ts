import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

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
          author: { select: { id: true, username: true, role: true } },
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

  async delete(id: number) {
    return prisma.post.delete({ where: { id } });
  }
}