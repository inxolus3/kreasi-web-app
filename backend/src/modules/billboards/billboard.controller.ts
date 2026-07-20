import { Request, Response, NextFunction } from 'express';
import { BillboardService } from './billboard.service';

const getImageUrl = (image: any): string | null => {
  if (!image || typeof image !== 'object' || typeof image.id !== 'number') {
    return null;
  }
  return `/api/v1/images/${image.id}`;
};

const getImageUrls = (images: any): string[] => {
  if (!Array.isArray(images)) {
    return [];
  }
  return images
    .map((image) => getImageUrl(image))
    .filter((url): url is string => typeof url === 'string');
};

const getImageIds = (images: any): number[] => {
  if (!Array.isArray(images)) {
    return [];
  }
  return images
    .map((image) => (image && typeof image.id === 'number' ? image.id : null))
    .filter((id): id is number => typeof id === 'number');
};

const formatBillboard = (billboard: any) => ({
  ...billboard,
  thumbnailId: billboard.thumbnail?.id ?? null,
  galleryImageIds: getImageIds(billboard.gallery),
  thumbnail: getImageUrl(billboard.thumbnail),
  gallery: getImageUrls(billboard.gallery),
});

export class BillboardController {
  constructor(private readonly billboardService: BillboardService) {}

  getPublicBillboards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.billboardService.getBillboards({
        ...req.query,
        limit: req.query.limit || '500',
      });

      const markers = result.data.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        latitude: b.latitude,
        longitude: b.longitude,
        province: b.province,
        city: b.city,
        district: b.district,
        address: b.address,
        traffic: b.traffic,
        thumbnail: getImageUrl(b.thumbnail),
        thumbnailId: b.thumbnail?.id ?? null,
        type: b.type,
        lighting: b.lighting,
        gallery: getImageUrls(b.gallery),
        galleryImageIds: getImageIds(b.gallery),
      }));

      res.status(200).json({ status: 'success', data: markers });
    } catch (error) {
      next(error);
    }
  };

  getPublicBillboardBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billboard = await this.billboardService.getBillboardBySlug(req.params.slug);
      const publicBillboard = {
        id: billboard.id,
        name: billboard.name,
        slug: billboard.slug,
        province: billboard.province,
        city: billboard.city,
        district: billboard.district,
        address: billboard.address,
        latitude: billboard.latitude,
        longitude: billboard.longitude,
        size: billboard.size,
        type: billboard.type,
        orientation: billboard.orientation,
        lighting: billboard.lighting,
        thumbnail: getImageUrl(billboard.thumbnail),
        thumbnailId: billboard.thumbnail?.id ?? null,
        description: billboard.description,
        gallery: getImageUrls(billboard.gallery),
        galleryImageIds: getImageIds(billboard.gallery),
        traffic: billboard.traffic,
        createdAt: billboard.createdAt,
        updatedAt: billboard.updatedAt,
      };
      res.status(200).json({ status: 'success', data: publicBillboard });
    } catch (error) {
      next(error);
    }
  };

  getPublicCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cities = await this.billboardService.getUniqueCities();
      res.status(200).json({ status: 'success', data: cities });
    } catch (error) {
      next(error);
    }
  };

  getPublicTypes = (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: this.billboardService.getTypes() });
  };

  getPublicLightings = (req: Request, res: Response) => {
    res.status(200).json({ status: 'success', data: this.billboardService.getLightings() });
  };

  createBillboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billboard = await this.billboardService.createBillboard(req.body);
      res.status(201).json({ status: 'success', data: formatBillboard(billboard) });
    } catch (error) {
      next(error);
    }
  };

  getAdminBillboards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.billboardService.getBillboards(req.query);
      const formatted = result.data.map(formatBillboard);
      res.status(200).json({ status: 'success', data: formatted, meta: result.meta });
    } catch (error) {
      next(error);
    }
  };

  getAdminBillboardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billboard = await this.billboardService.getBillboardById(parseInt(req.params.id, 10));
      res.status(200).json({ status: 'success', data: formatBillboard(billboard) });
    } catch (error) {
      next(error);
    }
  };

  updateBillboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const billboard = await this.billboardService.updateBillboard(id, req.body);
      res.status(200).json({ status: 'success', data: formatBillboard(billboard) });
    } catch (error) {
      next(error);
    }
  };

  updateBillboardStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const billboard = await this.billboardService.updateBillboardStatus(id, status as string);
      res.status(200).json({ status: 'success', data: billboard });
    } catch (error) {
      next(error);
    }
  };

  deleteBillboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.billboardService.deleteBillboard(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  uploadThumbnail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ status: 'fail', message: 'No file uploaded' });
        return;
      }

      const relativePath = `/uploads/${file.filename}`;
      const absoluteUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

      res.status(200).json({
        status: 'success',
        data: {
          filename: file.filename,
          url: absoluteUrl,
          relativePath,
        },
      });
    } catch (error: any) {
      next(error);
    }
  };

  uploadGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestWithFiles = req as Request & { files?: any[] };
      if (!requestWithFiles.files || (Array.isArray(requestWithFiles.files) && requestWithFiles.files.length === 0)) {
        res.status(400).json({ status: 'fail', message: 'No files uploaded' });
        return;
      }

      const files = requestWithFiles.files as any[];
      const urls = files.map((file) => {
        const relativePath = `/uploads/${file.filename}`;
        const absoluteUrl = `${req.protocol}://${req.get('host')}${relativePath}`;
        return {
          filename: file.filename,
          url: absoluteUrl,
          relativePath,
        };
      });

      res.status(200).json({
        status: 'success',
        data: urls,
      });
    } catch (error) {
      next(error);
    }
  };
}
