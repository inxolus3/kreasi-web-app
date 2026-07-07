import prisma from '../../utils/prisma';
import { Prisma, Tag } from '@prisma/client';

export class TagRepository {
  async create(data: Prisma.TagCreateInput): Promise<Tag> {
    return prisma.tag.create({ data });
  }

  async findAll(): Promise<Tag[]> {
    return prisma.tag.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: number): Promise<Tag | null> {
    return prisma.tag.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    return prisma.tag.findUnique({ where: { slug } });
  }

  async update(id: number, data: Prisma.TagUpdateInput): Promise<Tag> {
    return prisma.tag.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Tag> {
    return prisma.tag.delete({ where: { id } });
  }
}
