import prisma from '../../utils/prisma';
import { Prisma, Billboard, Image } from '@prisma/client';

export type BillboardWithImages = Billboard & {
  thumbnail?: Image | null;
  gallery?: Image[];
};

export type BillboardListArgs = {
  skip?: number;
  take?: number;
  where?: Prisma.BillboardWhereInput;
  orderBy?: Prisma.BillboardOrderByWithRelationInput;
  select?: Prisma.BillboardSelect;
  include?: Prisma.BillboardInclude;
};

export class BillboardRepository {
  async create(data: Prisma.BillboardCreateInput): Promise<BillboardWithImages> {
    return prisma.billboard.create({
      data,
      include: {
        thumbnail: true,
        gallery: true,
      },
    });
  }

  async findMany(params: BillboardListArgs): Promise<BillboardWithImages[]> {
    return prisma.billboard.findMany(params as any);
  }

  async count(where?: Prisma.BillboardWhereInput): Promise<number> {
    return prisma.billboard.count({ where });
  }

  async findById(id: number): Promise<BillboardWithImages | null> {
    return prisma.billboard.findUnique({
      where: { id },
      include: {
        thumbnail: true,
        gallery: true,
      },
    });
  }

  async findByIdOrThrow(id: number): Promise<BillboardWithImages> {
    const billboard = await prisma.billboard.findUnique({
      where: { id },
      include: {
        thumbnail: true,
        gallery: true,
      },
    });
    if (!billboard) {
      throw new Error('Billboard not found');
    }
    return billboard;
  }

  async findBySlug(slug: string): Promise<BillboardWithImages | null> {
    return prisma.billboard.findUnique({
      where: { slug },
      include: {
        thumbnail: true,
        gallery: true,
      },
    });
  }

  async findBySlugOrThrow(slug: string): Promise<BillboardWithImages> {
    const billboard = await prisma.billboard.findUnique({
      where: { slug },
      include: {
        thumbnail: true,
        gallery: true,
      },
    });
    if (!billboard) {
      throw new Error('Billboard not found');
    }
    return billboard;
  }

  async findByCode(code: string): Promise<Billboard | null> {
    return prisma.billboard.findUnique({ where: { code } });
  }

  async update(id: number, data: Prisma.BillboardUpdateInput): Promise<BillboardWithImages> {
    return prisma.billboard.update({
      where: { id },
      data,
      include: {
        thumbnail: true,
        gallery: true,
      },
    });
  }

  async delete(id: number): Promise<Billboard> {
    return prisma.billboard.delete({ where: { id } });
  }

  getPrismaClient() {
    return prisma;
  }
}
