import { Request, Response, NextFunction } from 'express';
import { MediaService } from './media.service';

export class MediaController {
  public static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
      }
      const media = await MediaService.uploadFile(req.file, req.user!.sub);
      res.status(201).json({ success: true, data: media });
    } catch (error) { next(error); }
  }

  public static async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ success: false, error: 'No files uploaded' });
      }
      const files = req.files as Express.Multer.File[];
      const results = await Promise.all(files.map(f => MediaService.uploadFile(f, req.user!.sub)));
      res.status(201).json({ success: true, data: results });
    } catch (error) { next(error); }
  }

  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, type } = req.query;
      const result = await MediaService.listMedia(
        parseInt(page as string) || 1,
        parseInt(limit as string) || 50,
        type as string
      );
      res.json({ success: true, ...result });
    } catch (error) { next(error); }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await MediaService.deleteMedia(req.params.id);
      res.json({ success: true, message: 'Media deleted' });
    } catch (error) { next(error); }
  }
}