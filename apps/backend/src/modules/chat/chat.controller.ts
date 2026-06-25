import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { logger } from '../../config/logger';

export class ChatController {
  public static async createConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const conversation = await ChatService.createConversation(
        req.user!.sub,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Conversation created',
        data: conversation,
      });
    } catch (error) {
      logger.error({ error }, 'Create conversation error');
      next(error);
    }
  }

  public static async listConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, status } = req.query;
      const result = await ChatService.listConversations(
        req.user!.sub,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 20,
        status as string
      );

      res.json({ success: true, ...result });
    } catch (error) {
      logger.error({ error }, 'List conversations error');
      next(error);
    }
  }

  public static async getConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info(`Getting conversation: ${req.params.id}`);
      const conversation = await ChatService.getConversation(
        req.params.id,
        req.user!.sub
      );

      if (!conversation) {
        res.status(404).json({
          success: false,
          error: 'Conversation not found',
          code: 'NOT_FOUND',
        });
        return;
      }

      res.json({ success: true, data: conversation });
    } catch (error) {
      logger.error({ error }, 'Get conversation error');
      next(error);
    }
  }

  public static async sendMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await ChatService.sendMessage(
        req.params.id,
        req.user!.sub,
        req.body.content
      );

      res.status(201).json({
        success: true,
        message: 'Message sent',
        data: result,
      });
    } catch (error) {
      logger.error({ error }, 'Send message error');
      next(error);
    }
  }

  public static async archiveConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await ChatService.archiveConversation(req.params.id, req.user!.sub);
      res.json({ success: true, message: 'Conversation archived' });
    } catch (error) {
      next(error);
    }
  }
}