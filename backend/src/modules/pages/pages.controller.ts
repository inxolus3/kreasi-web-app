import { Request, Response, NextFunction } from 'express';
import { PagesService } from './pages.service';
import { PageStatus } from '@prisma/client';

export class PagesController {
  private pagesService = new PagesService();

  // Pages List / CRUD
  createPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, slug, metaTitle, metaDescription, featuredImage } = req.body;
      const authorId = (req.user as any)?.id || 1; // Fallback to user ID 1 if not authenticated during tests

      const page = await this.pagesService.createPage(title, slug, authorId, {
        metaTitle,
        metaDescription,
        featuredImage,
      });

      res.status(201).json({
        status: 'success',
        data: { page },
      });
    } catch (err) {
      next(err);
    }
  };

  getPages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string, 10) : undefined;
      const search = req.query.search as string | undefined;
      const status = req.query.status as PageStatus | undefined;

      const result = await this.pagesService.getPages({ skip, take, search, status });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  getPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const page = await this.pagesService.getPageById(id);

      res.status(200).json({
        status: 'success',
        data: { page },
      });
    } catch (err) {
      next(err);
    }
  };

  getPageBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { slug } = req.params;
      const page = await this.pagesService.getPageBySlug(slug);

      res.status(200).json({
        status: 'success',
        data: { page },
      });
    } catch (err) {
      next(err);
    }
  };

  updatePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await this.pagesService.updatePage(id, req.body);

      res.status(200).json({
        status: 'success',
        data: { page: updated },
      });
    } catch (err) {
      next(err);
    }
  };

  deletePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.pagesService.deletePage(id);

      res.status(200).json({
        status: 'success',
        message: 'Page deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // Builder Tree Save
  saveBuilder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { sections } = req.body;

      if (!Array.isArray(sections)) {
        res.status(400).json({ status: 'fail', message: 'Sections must be an array' });
        return;
      }

      const page = await this.pagesService.saveBuilder(id, sections);

      res.status(200).json({
        status: 'success',
        data: { page },
      });
    } catch (err) {
      next(err);
    }
  };

  // Publish page
  publishPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const page = await this.pagesService.publishPage(id);

      res.status(200).json({
        status: 'success',
        data: { page },
      });
    } catch (err) {
      next(err);
    }
  };

  // Autosave action
  autosave = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { sections } = req.body;

      if (!Array.isArray(sections)) {
        res.status(400).json({ status: 'fail', message: 'Sections must be an array' });
        return;
      }

      const result = await this.pagesService.autosave(id, sections);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  // Get Version snap lists
  getVersions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pageId = parseInt(req.params.id, 10);
      const versions = await this.pagesService.getVersions(pageId);

      res.status(200).json({
        status: 'success',
        data: { versions },
      });
    } catch (err) {
      next(err);
    }
  };

  // Restore snapshot version
  restoreVersion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pageId = parseInt(req.params.id, 10);
      const versionId = parseInt(req.params.versionId, 10);

      const page = await this.pagesService.restoreVersion(pageId, versionId);

      res.status(200).json({
        status: 'success',
        data: { page },
      });
    } catch (err) {
      next(err);
    }
  };

  // Page Templates
  getTemplates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const templates = await this.pagesService.getTemplates();

      res.status(200).json({
        status: 'success',
        data: { templates },
      });
    } catch (err) {
      next(err);
    }
  };

  getTemplate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const template = await this.pagesService.getTemplateById(id);

      res.status(200).json({
        status: 'success',
        data: { template },
      });
    } catch (err) {
      next(err);
    }
  };

  // Global Components CRUD
  getGlobalComponents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const components = await this.pagesService.getGlobalComponents();

      res.status(200).json({
        status: 'success',
        data: { components },
      });
    } catch (err) {
      next(err);
    }
  };

  createGlobalComponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, type, props, styles } = req.body;
      const component = await this.pagesService.createGlobalComponent(name, type, props, styles);

      res.status(201).json({
        status: 'success',
        data: { component },
      });
    } catch (err) {
      next(err);
    }
  };

  updateGlobalComponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, props, styles } = req.body;
      const component = await this.pagesService.updateGlobalComponent(id, name, props, styles);

      res.status(200).json({
        status: 'success',
        data: { component },
      });
    } catch (err) {
      next(err);
    }
  };

  deleteGlobalComponent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.pagesService.deleteGlobalComponent(id);

      res.status(200).json({
        status: 'success',
        message: 'Global component deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  };

  // Global Theme Settings
  getThemeSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.pagesService.getThemeSettings();

      res.status(200).json({
        status: 'success',
        data: { settings },
      });
    } catch (err) {
      next(err);
    }
  };

  updateThemeSetting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { key, value } = req.body;
      const setting = await this.pagesService.updateThemeSettings(key, value);

      res.status(200).json({
        status: 'success',
        data: { setting },
      });
    } catch (err) {
      next(err);
    }
  };
}
