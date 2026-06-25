import { Request, Response, NextFunction } from 'express';
import { KnowledgeBaseService } from './kb.service';
import { logger } from '../../config/logger';

export class KnowledgeBaseController {
  public static async listArticles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, ...filters } = req.query;

      const result = await KnowledgeBaseService.listArticles(
        filters,
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

  public static async getArticle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const article = await KnowledgeBaseService.getArticleBySlug(req.params.slug);

      res.json({
        success: true,
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createArticle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const article = await KnowledgeBaseService.createArticle(req.body);

      res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateArticle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const article = await KnowledgeBaseService.updateArticle(
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        message: 'Article updated successfully',
        data: article,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteArticle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await KnowledgeBaseService.deleteArticle(req.params.id);

      res.json({
        success: true,
        message: 'Article deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async generateEmbeddings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await KnowledgeBaseService.generateEmbeddings(req.params.id);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async search(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const results = await KnowledgeBaseService.semanticSearch(
        req.body.query,
        req.body.limit || 5
      );

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }
}