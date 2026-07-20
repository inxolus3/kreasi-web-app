import { Request, Response, NextFunction } from 'express';
import { BillboardService } from './billboard.service';

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
        thumbnail: b.thumbnail,
        type: b.type,
        lighting: b.lighting,
        gallery: b.gallery || [],
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
        thumbnail: billboard.thumbnail,
        description: billboard.description,
        gallery: billboard.gallery,
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
      res.status(201).json({ status: 'success', data: billboard });
    } catch (error) {
      next(error);
    }
  };

  getAdminBillboards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.billboardService.getBillboards(req.query);
      res.status(200).json({ status: 'success', ...result });
    } catch (error) {
      next(error);
    }
  };

  getAdminBillboardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billboard = await this.billboardService.getBillboardById(parseInt(req.params.id, 10));
      res.status(200).json({ status: 'success', data: billboard });
    } catch (error) {
      next(error);
    }
  };

  updateBillboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const billboard = await this.billboardService.updateBillboard(id, req.body);
      res.status(200).json({ status: 'success', data: billboard });
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
      if (!req.file) {
        res.status(400).json({ status: 'fail', message: 'No file uploaded' });
        return;
      }

      const relativePath = `/uploads/${req.file.filename}`;
      const absoluteUrl = `${req.protocol}://${req.get('host')}${relativePath}`;

      res.status(200).json({
        status: 'success',
        data: {
          filename: req.file.filename,
          url: absoluteUrl,
          relativePath,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  uploadGallery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({ status: 'fail', message: 'No files uploaded' });
        return;
      }

      const files = req.files as Express.Multer.File[];
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
