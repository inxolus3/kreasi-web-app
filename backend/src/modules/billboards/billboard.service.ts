import { BillboardRepository } from './billboard.repository';
import { Prisma, Billboard } from '@prisma/client';
import { AppError } from '../../errors/AppError';

export class BillboardService {
  constructor(private readonly billboardRepository: BillboardRepository) {}

  async createBillboard(data: Prisma.BillboardCreateInput): Promise<Billboard> {
    const existingCode = await this.billboardRepository.findByCode(data.code as string);
    if (existingCode) {
      throw new AppError('Billboard with this code already exists', 409);
    }

    const existingSlug = await this.billboardRepository.findBySlug(data.slug as string);
    if (existingSlug) {
      throw new AppError('Billboard with this slug already exists', 409);
    }

    return this.billboardRepository.create(data);
  }

  async getBillboards(query: Record<string, unknown>) {
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
    if (typeof query.status === 'string' && query.status) {
      where.status = { equals: query.status, mode: 'insensitive' };
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

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (typeof query.minPrice === 'string' && query.minPrice) {
        where.price.gte = parseFloat(query.minPrice);
      }
      if (typeof query.maxPrice === 'string' && query.maxPrice) {
        where.price.lte = parseFloat(query.maxPrice);
      }
    }

    const [billboards, total] = await Promise.all([
      this.billboardRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          code: true,
          name: true,
          slug: true,
          province: true,
          city: true,
          district: true,
          address: true,
          latitude: true,
          longitude: true,
          size: true,
          type: true,
          orientation: true,
          lighting: true,
          price: true,
          status: true,
          thumbnail: true,
          description: true,
          createdAt: true,
          updatedAt: true,
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

  async getBillboardById(id: number): Promise<Billboard> {
    const billboard = await this.billboardRepository.findById(id);
    if (!billboard) {
      throw new AppError('Billboard not found', 404);
    }
    return billboard;
  }

  async getBillboardBySlug(slug: string): Promise<Billboard> {
    const billboard = await this.billboardRepository.findBySlug(slug);
    if (!billboard) {
      throw new AppError('Billboard not found', 404);
    }
    return billboard;
  }

  async updateBillboard(id: number, data: Prisma.BillboardUpdateInput): Promise<Billboard> {
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

    return this.billboardRepository.update(id, data);
  }

  async updateBillboardStatus(id: number, status: string): Promise<Billboard> {
    const existing = await this.billboardRepository.findById(id);
    if (!existing) {
      throw new AppError('Billboard not found', 404);
    }

    return this.billboardRepository.update(id, { status });
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
