import { Request, Response, NextFunction } from 'express';
import { LandingService } from './landing.service';

export class LandingController {
  public static async getLandingPage(req: Request, res: Response, next: NextFunction) {
    try {
      const landing = await LandingService.getLandingPage();
      res.json({ success: true, data: landing });
    } catch (error) {
      next(error);
    }
  }

  public static async updateLandingPage(req: Request, res: Response, next: NextFunction) {
    try {
      const landing = await LandingService.updateLandingPage(req.body);
      res.json({ success: true, message: 'Landing page updated', data: landing });
    } catch (error) {
      next(error);
    }
  }
}