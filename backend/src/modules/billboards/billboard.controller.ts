import { Request, Response, NextFunction } from 'express';
import { BillboardService } from './billboard.service';
import { BillboardStatus } from '@prisma/client';

export class BillboardController {
  private billboardService: BillboardService;

  constructor() {
    this.billboardService = new BillboardService();
  }

  // PUBLIC APIs
  getPublicBillboards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Public map markers only need lightweight information (latitude, longitude, basic details)
      // We will fetch all active/available billboards (or let filters apply)
      const result = await this.billboardService.getBillboards({
        ...req.query,
        limit: req.query.limit || '500', // Allow more markers on maps by default
      });

      // Map to lightweight marker items
      const markers = result.data.map((b) => ({
        id: b.id,
        code: b.code,
        name: b.name,
        slug: b.slug,
        latitude: b.latitude,
        longitude: b.longitude,
        province: b.province,
        city: b.city,
        district: b.district,
        address: b.address,
        price: b.price,
        status: b.status,
        thumbnail: b.thumbnail,
      }));

      res.status(200).json({ status: 'success', data: markers });
    } catch (error) {
      next(error);
    }
  };

  getPublicBillboardBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billboard = await this.billboardService.getBillboardBySlug(req.params.slug);
      res.status(200).json({ status: 'success', data: billboard });
    } catch (error: any) {
      if (error.message === 'Billboard not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
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
    const types = this.billboardService.getTypes();
    res.status(200).json({ status: 'success', data: types });
  };

  getPublicLightings = (req: Request, res: Response) => {
    const lightings = this.billboardService.getLightings();
    res.status(200).json({ status: 'success', data: lightings });
  };

  // ADMIN APIs (CRUD)
  createBillboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const billboard = await this.billboardService.createBillboard(req.body);
      res.status(201).json({ status: 'success', data: billboard });
    } catch (error: any) {
      if (
        error.message === 'Billboard with this code already exists' ||
        error.message === 'Billboard with this slug already exists'
      ) {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
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
    } catch (error: any) {
      if (error.message === 'Billboard not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  updateBillboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const billboard = await this.billboardService.updateBillboard(id, req.body);
      res.status(200).json({ status: 'success', data: billboard });
    } catch (error: any) {
      if (
        error.message === 'Billboard not found' ||
        error.message === 'Billboard with this code already exists' ||
        error.message === 'Billboard with this slug already exists'
      ) {
        res.status(400).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  updateBillboardStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const billboard = await this.billboardService.updateBillboardStatus(id, status as BillboardStatus);
      res.status(200).json({ status: 'success', data: billboard });
    } catch (error: any) {
      if (error.message === 'Billboard not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  deleteBillboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.billboardService.deleteBillboard(id);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Billboard not found') {
        res.status(404).json({ status: 'fail', message: error.message });
        return;
      }
      next(error);
    }
  };

  // UPLOAD APIs
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
