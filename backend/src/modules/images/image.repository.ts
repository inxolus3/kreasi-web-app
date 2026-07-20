import { Image } from '@prisma/client';
import prisma from '../../utils/prisma';

export interface CreateImageInput {
  filename: string;
  mimeType: string;
  data: Buffer;
  size: number;
}

export class ImageRepository {
  async create(input: CreateImageInput): Promise<Image> {
    return prisma.image.create({
      data: {
        filename: input.filename,
        mimeType: input.mimeType,
        data: input.data,
        size: input.size,
      },
    });
  }

  async findById(id: number): Promise<Image | null> {
    return prisma.image.findUnique({ where: { id } });
  }

  async deleteById(id: number): Promise<Image> {
    return prisma.image.delete({ where: { id } });
  }

  async findByIds(ids: number[]): Promise<Image[]> {
    return prisma.image.findMany({ where: { id: { in: ids } } });
  }
}
