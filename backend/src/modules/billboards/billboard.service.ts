import { BillboardRepository, BillboardWithImages } from './billboard.repository';
import { Prisma, Billboard } from '@prisma/client';
import { AppError } from '../../errors/AppError';

export class BillboardService {
  constructor(private readonly billboardRepository: BillboardRepository) {}

  async createBillboard(data: Prisma.BillboardCreateInput): Promise<BillboardWithImages> {
    const existingCode = await this.billboardRepository.findByCode(data.code as string);
    if (existingCode) {
      throw new AppError('Billboard with this code already exists', 409);
    }

    const existingSlug = await this.billboardRepository.findBySlug(data.slug as string);
    if (existingSlug) {
      throw new AppError('Billboard with this slug already exists', 409);
    }

    const { thumbnailImageId, galleryImageIds, ...payload } = data as unknown as {
      thumbnailImageId?: number | null;
      galleryImageIds?: number[];
      [key: string]: unknown;
    };

    const createData: Prisma.BillboardCreateInput = {
      ...payload,
    } as Prisma.BillboardCreateInput;

    if (thumbnailImageId) {
      createData.thumbnail = { connect: { id: thumbnailImageId } };
    }

    if (galleryImageIds && galleryImageIds.length > 0) {
      createData.gallery = { connect: galleryImageIds.map((id) => ({ id })) } as any;
    }

    return this.billboardRepository.create(createData);
  }

  async getBillboards(query: Record<string, unknown>): Promise<{ data: BillboardWithImages[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
    const page = parseInt(String(query.page ?? '1'), 10);
    const limit = parseInt(String(query.limit ?? '10'), 10);
    const skip = (page - 1) * limit;

    const where: Prisma.BillboardWhereInput = {};

    if (typeof query.search === 'string' && query.search.trim()) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { district: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (typeof query.province === 'string' && query.province) {
      where.province = { equals: query.province, mode: 'insensitive' };
    }
    if (typeof query.city === 'string' && query.city) {
      where.city = { equals: query.city, mode: 'insensitive' };
    }
    if (typeof query.district === 'string' && query.district) {
      where.district = { equals: query.district, mode: 'insensitive' };
    }
    if (typeof query.type === 'string' && query.type) {
      where.type = { equals: query.type, mode: 'insensitive' };
    }
    if (typeof query.orientation === 'string' && query.orientation) {
      where.orientation = { equals: query.orientation, mode: 'insensitive' };
    }
    if (typeof query.lighting === 'string' && query.lighting) {
      where.lighting = { equals: query.lighting, mode: 'insensitive' };
    }

    const [billboards, total] = await Promise.all([
      this.billboardRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          thumbnail: true,
          gallery: true,
        },
      }),
      this.billboardRepository.count(where),
    ]);

    return {
      data: billboards,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBillboardById(id: number): Promise<BillboardWithImages> {
    const billboard = await this.billboardRepository.findById(id);
    if (!billboard) {
      throw new AppError('Billboard not found', 404);
    }
    return billboard;
  }

  async getBillboardBySlug(slug: string): Promise<BillboardWithImages> {
    const billboard = await this.billboardRepository.findBySlug(slug);
    if (!billboard) {
      throw new AppError('Billboard not found', 404);
    }
    return billboard;
  }

  async updateBillboard(id: number, data: Prisma.BillboardUpdateInput): Promise<BillboardWithImages> {
    const existing = await this.billboardRepository.findById(id);
    if (!existing) {
      throw new AppError('Billboard not found', 404);
    }

    if (typeof data.code === 'string' && data.code !== existing.code) {
      const existingCode = await this.billboardRepository.findByCode(data.code);
      if (existingCode) {
        throw new AppError('Billboard with this code already exists', 409);
      }
    }

    if (typeof data.slug === 'string' && data.slug !== existing.slug) {
      const existingSlug = await this.billboardRepository.findBySlug(data.slug);
      if (existingSlug) {
        throw new AppError('Billboard with this slug already exists', 409);
      }
    }

    const { thumbnailImageId, galleryImageIds, ...rest } = data as unknown as {
      thumbnailImageId?: number | null;
      galleryImageIds?: number[];
      [key: string]: unknown;
    };

    const updateData: Prisma.BillboardUpdateInput = { ...rest };

    if (thumbnailImageId !== undefined) {
      updateData.thumbnail = thumbnailImageId
        ? { connect: { id: thumbnailImageId } }
        : { disconnect: true };
    }

    if (galleryImageIds) {
      updateData.gallery = { set: galleryImageIds.map((id) => ({ id })) } as any;
    }

    return this.billboardRepository.update(id, updateData);
  }

  async updateBillboardStatus(id: number, status: string): Promise<BillboardWithImages> {
    const existing = await this.billboardRepository.findById(id);
    if (!existing) {
      throw new AppError('Billboard not found', 404);
    }

    return this.billboardRepository.update(id, { status } as any);
  }

  async deleteBillboard(id: number): Promise<Billboard> {
    const existing = await this.billboardRepository.findById(id);
    if (!existing) {
      throw new AppError('Billboard not found', 404);
    }
    return this.billboardRepository.delete(id);
  }

  async getUniqueCities(): Promise<string[]> {
    const cities = await this.billboardRepository.getPrismaClient().billboard.findMany({
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    });
    return cities.map((c) => c.city);
  }

  getTypes(): string[] {
    return ['Baliho', 'Billboard'];
  }

  getLightings(): string[] {
    return ['Back Light', 'Front Light', 'Non Light'];
  }
}
