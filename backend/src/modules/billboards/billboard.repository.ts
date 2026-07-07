import prisma from '../../utils/prisma';
import { Prisma, Billboard } from '@prisma/client';

export class BillboardRepository {
  async create(data: Prisma.BillboardCreateInput): Promise<Billboard> {
    return prisma.billboard.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BillboardWhereInput;
    orderBy?: Prisma.BillboardOrderByWithRelationInput;
  }): Promise<Billboard[]> {
    const { skip, take, where, orderBy } = params;
    return prisma.billboard.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async count(where?: Prisma.BillboardWhereInput): Promise<number> {
    return prisma.billboard.count({ where });
  }

  async findById(id: number): Promise<Billboard | null> {
    return prisma.billboard.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Billboard | null> {
    return prisma.billboard.findUnique({ where: { slug } });
  }

  async findByCode(code: string): Promise<Billboard | null> {
    return prisma.billboard.findUnique({ where: { code } });
  }

  async update(id: number, data: Prisma.BillboardUpdateInput): Promise<Billboard> {
    return prisma.billboard.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Billboard> {
    return prisma.billboard.delete({ where: { id } });
  }

  getPrismaClient() {
    return prisma;
  }
}
