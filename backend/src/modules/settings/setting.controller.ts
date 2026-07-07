import { Request, Response, NextFunction } from 'express';
import { SettingService } from './setting.service';

export class SettingController {
  private settingService: SettingService;

  constructor() {
    this.settingService = new SettingService();
  }

  /**
   * Retrieves all settings (both public and admin access)
   */
  getSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settings = await this.settingService.getAllSettings();
      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieves settings filtered by a specific group
   */
  getSettingsByGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { group } = req.params;
      const settings = await this.settingService.getSettingsByGroup(group);
      res.status(200).json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Updates settings (requires ADMIN role)
   */
  updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updatedSettings = await this.settingService.updateSettings(req.body);
      res.status(200).json({
        status: 'success',
        message: 'Settings updated successfully.',
        data: updatedSettings,
      });
    } catch (error) {
      next(error);
    }
  };
}
