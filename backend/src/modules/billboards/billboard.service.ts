import { BillboardRepository } from './billboard.repository';
import { Prisma, BillboardStatus } from '@prisma/client';

export class BillboardService {
  private billboardRepository: BillboardRepository;

  constructor() {
    this.billboardRepository = new BillboardRepository();
  }

  async createBillboard(data: any) {
    // Check code uniqueness
    const existingCode = await this.billboardRepository.findByCode(data.code);
    if (existingCode) {
      throw new Error('Billboard with this code already exists');
    }

    // Check slug uniqueness
    const existingSlug = await this.billboardRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw new Error('Billboard with this slug already exists');
    }

    return this.billboardRepository.create(data);
  }

  async getBillboards(query: any) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const where: Prisma.BillboardWhereInput = {};

    // Search filter: matching code, name, city, district, or address
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
        { district: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Exact match filters
    if (query.province) {
      where.province = { equals: query.province, mode: 'insensitive' };
    }
    if (query.city) {
      where.city = { equals: query.city, mode: 'insensitive' };
    }
    if (query.district) {
      where.district = { equals: query.district, mode: 'insensitive' };
    }
    if (query.status) {
      where.status = query.status as BillboardStatus;
    }
    if (query.type) {
      where.type = { equals: query.type, mode: 'insensitive' };
    }
    if (query.orientation) {
      where.orientation = { equals: query.orientation, mode: 'insensitive' };
    }
    if (query.lighting) {
      where.lighting = { equals: query.lighting, mode: 'insensitive' };
    }

    // Price range filters
    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) {
        where.price.gte = parseFloat(query.minPrice);
      }
      if (query.maxPrice) {
        where.price.lte = parseFloat(query.maxPrice);
      }
    }

    const [billboards, total] = await Promise.all([
      this.billboardRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
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

  async getBillboardById(id: number) {
    const billboard = await this.billboardRepository.findById(id);
    if (!billboard) {
      throw new Error('Billboard not found');
    }
    return billboard;
  }

  async getBillboardBySlug(slug: string) {
    const billboard = await this.billboardRepository.findBySlug(slug);
    if (!billboard) {
      throw new Error('Billboard not found');
    }
    return billboard;
  }

  async updateBillboard(id: number, data: any) {
    const existing = await this.billboardRepository.findById(id);
    if (!existing) {
      throw new Error('Billboard not found');
    }

    if (data.code && data.code !== existing.code) {
      const existingCode = await this.billboardRepository.findByCode(data.code);
      if (existingCode) {
        throw new Error('Billboard with this code already exists');
      }
    }

    if (data.slug && data.slug !== existing.slug) {
      const existingSlug = await this.billboardRepository.findBySlug(data.slug);
      if (existingSlug) {
        throw new Error('Billboard with this slug already exists');
      }
    }

    return this.billboardRepository.update(id, data);
  }

  async updateBillboardStatus(id: number, status: BillboardStatus) {
    const existing = await this.billboardRepository.findById(id);
    if (!existing) {
      throw new Error('Billboard not found');
    }

    return this.billboardRepository.update(id, { status });
  }

  async deleteBillboard(id: number) {
    const existing = await this.billboardRepository.findById(id);
    if (!existing) {
      throw new Error('Billboard not found');
    }
    return this.billboardRepository.delete(id);
  }

  async getUniqueCities() {
    const cities = await this.billboardRepository.getPrismaClient().billboard.findMany({
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    });
    return cities.map(c => c.city);
  }

  getTypes() {
    return ['Baliho', 'Billboard'];
  }

  getLightings() {
    return ['Back Light', 'Front Light', 'Non Light'];
  }
}
