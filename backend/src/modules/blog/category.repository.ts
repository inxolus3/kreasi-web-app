import prisma from '../../utils/prisma';
import { Prisma, Category } from '@prisma/client';

export class CategoryRepository {
  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, slug: true, createdAt: true, updatedAt: true },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } });
  }

  async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Category> {
    return prisma.category.delete({ where: { id } });
  }
}
