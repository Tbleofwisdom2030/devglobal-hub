import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';

export class SettingsController {
  public static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error) { next(error); }
  }

  public static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.updateSettings(req.body);
      res.json({ success: true, message: 'Settings updated', data: settings });
    } catch (error) { next(error); }
  }
}