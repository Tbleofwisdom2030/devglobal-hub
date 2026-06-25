import { Request, Response, NextFunction } from 'express';
import { LicenseService } from './licenses.service';
import { logger } from '../../config/logger';

export class LicensesController {
  public static async listLicenses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit } = req.query;

      const result = await LicenseService.listUserLicenses(
        req.user!.sub,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const license = await LicenseService.getLicenseById(
        req.params.id,
        req.user!.sub
      );

      res.json({
        success: true,
        data: license,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async validateLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await LicenseService.validateLicense(
        req.body.licenseKey,
        req.body.productSlug
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async activateLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const license = await LicenseService.activateLicense(
        req.params.id,
        req.body.deviceId
      );

      res.json({
        success: true,
        message: 'License activated successfully',
        data: license,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async revokeLicense(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const license = await LicenseService.revokeLicense(
        req.params.id,
        req.body.reason
      );

      res.json({
        success: true,
        message: 'License revoked successfully',
        data: license,
      });
    } catch (error) {
      next(error);
    }
  }
}