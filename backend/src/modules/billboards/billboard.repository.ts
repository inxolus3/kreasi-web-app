import prisma from '../../utils/prisma';
import { Prisma, Billboard } from '@prisma/client';

export type BillboardListArgs = {
  skip?: number;
  take?: number;
  where?: Prisma.BillboardWhereInput;
  orderBy?: Prisma.BillboardOrderByWithRelationInput;
  select?: Prisma.BillboardSelect;
};

export class BillboardRepository {
  async create(data: Prisma.BillboardCreateInput): Promise<Billboard> {
    return prisma.billboard.create({ data });
  }

  async findMany(params: BillboardListArgs): Promise<Billboard[]> {
    const { skip, take, where, orderBy, select } = params;
    return prisma.billboard.findMany({
      skip,
      take,
      where,
      orderBy,
      select,
    });
  }

  async count(where?: Prisma.BillboardWhereInput): Promise<number> {
    return prisma.billboard.count({ where });
  }

  async findById(id: number): Promise<Billboard | null> {
    return prisma.billboard.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: number): Promise<Billboard> {
    const billboard = await prisma.billboard.findUnique({ where: { id } });
    if (!billboard) {
      throw new Error('Billboard not found');
    }
    return billboard;
  }

  async findBySlug(slug: string): Promise<Billboard | null> {
    return prisma.billboard.findUnique({ where: { slug } });
  }

  async findBySlugOrThrow(slug: string): Promise<Billboard> {
    const billboard = await prisma.billboard.findUnique({ where: { slug } });
    if (!billboard) {
      throw new Error('Billboard not found');
    }
    return billboard;
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
