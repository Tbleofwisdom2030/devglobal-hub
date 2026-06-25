import { Request, Response, NextFunction } from 'express';
import { TicketsService } from './tickets.service';
import { logger } from '../../config/logger';

export class TicketsController {
  public static async createTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ticket = await TicketsService.createTicket(
        req.user!.sub,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Ticket created successfully',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async listTickets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, sortBy, sortOrder, ...filters } = req.query;

      const result = await TicketsService.listTickets(
        req.user!.sub,
        filters,
        parseInt(page as string) || 1,
        parseInt(limit as string) || 10,
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ticket = await TicketsService.getTicketById(
        req.params.id,
        req.user!.sub
      );

      res.json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ticket = await TicketsService.updateTicket(
        req.params.id,
        req.body,
        req.user!.sub
      );

      res.json({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async addMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const message = await TicketsService.addMessage(
        req.params.id,
        req.user!.sub,
        req.user!.role === 'ADMIN' || req.user!.role === 'SUPPORT'
          ? 'SUPPORT'
          : 'CUSTOMER',
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Message added successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAISummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const summary = await TicketsService.getAISummary(req.params.id);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async findSimilarTickets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const similar = await TicketsService.findSimilarTickets(
        req.query.ticketId as string
      );

      res.json({
        success: true,
        data: similar,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async listAllTickets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page, limit, ...filters } = req.query;

      const result = await TicketsService.listAllTickets(
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

  public static async assignTicket(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const ticket = await TicketsService.updateTicket(req.params.id, {
        assignedTo: req.body.assignedTo,
      });

      res.json({
        success: true,
        message: 'Ticket assigned successfully',
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }
}