import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { Sanitizer } from '../../utils/sanitizer';
import { NotFoundError, AppError, ForbiddenError } from '../../middleware/error-handler';
import { env } from '../../config/env';
import { queueManager } from '../../config/queue';
import { CreateTicketDTO, UpdateTicketDTO, AddMessageDTO } from './tickets.types';

import { v4 as uuidv4 } from 'uuid';

export class TicketsService {
  public static async createTicket(
    userId: string,
    data: CreateTicketDTO
  ) {
    const ticket = await prisma.supportTicket.create({
      data: {
        id: uuidv4(),
        userId,
        productId: data.productId || null,
        subject: Sanitizer.sanitizePlainText(data.subject),
        status: 'OPEN' as any,
        priority: (data.priority as any) || 'MEDIUM',
        category: data.category || null,
        messages: {
          create: {
            id: uuidv4(),
            senderId: userId,
            senderType: 'CUSTOMER',
            content: Sanitizer.sanitizeHtml(data.message),
          },
        },
      },
      include: {
        messages: true,
        product: {
          select: { name: true, slug: true },
        },
      },
    });

    // Process with AI if enabled
    if (env.ENABLE_AI_FEATURES) {
      await queueManager.addJob(
        'ai-processing',
        'analyze-ticket',
        {
          type: 'ai-process',
          payload: {
            ticketId: ticket.id,
            action: 'analyze',
          },
        },
        { priority: 2 }
      );
    }

    // Send notification
    if (env.ENABLE_EMAIL_NOTIFICATIONS) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });
      
      if (user) {
        await queueManager.addJob('emails', 'send-ticket-created', {
          type: 'send-email',
          payload: {
            to: user.email,
            subject: `Ticket Created: ${ticket.subject}`,
            template: 'ticket-created',
            data: {
              ticketId: ticket.id,
              subject: ticket.subject,
            },
          },
        });
      }
    }

    logger.info(`Ticket created: ${ticket.id} by user ${userId}`);

    return ticket;
  }

  public static async listTickets(
    userId: string,
    filters: any,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<any>> {
    const where: any = { userId };

    if (filters.status) {
      where.status = filters.status as any;
    }

    if (filters.priority) {
      where.priority = filters.priority as any;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        select: {
          id: true,
          subject: true,
          status: true,
          priority: true,
          category: true,
          aiSummary: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: { name: true, slug: true },
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(tickets, total, { page, limit });
  }

  public static async getTicketById(ticketId: string, userId?: string) {
    const where: any = { id: ticketId };
    
    if (userId) {
      where.userId = userId;
    }

    const ticket = await prisma.supportTicket.findFirst({
      where,
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        product: {
          select: { name: true, slug: true },
        },
        user: {
          select: { id: true, fullName: true, email: true, avatarUrl: true },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    return ticket;
  }

  public static async updateTicket(
    ticketId: string,
    data: UpdateTicketDTO,
    userId?: string
  ) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    // Only owner or admin/support can update
    if (userId && ticket.userId !== userId) {
      throw new ForbiddenError('You can only update your own tickets');
    }

    const updateData: any = {};
    
    if (data.subject) updateData.subject = Sanitizer.sanitizePlainText(data.subject);
    if (data.status) updateData.status = data.status as any;
    if (data.priority) updateData.priority = data.priority as any;
    if (data.category) updateData.category = data.category;
    if (data.assignedTo) updateData.assignedTo = data.assignedTo;
    if (data.status === 'RESOLVED') updateData.resolvedAt = new Date();

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    });

    logger.info(`Ticket updated: ${ticketId}`);

    return updated;
  }

  public static async addMessage(
    ticketId: string,
    senderId: string,
    senderType: string,
    data: AddMessageDTO
  ) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    if (ticket.status === 'CLOSED') {
      throw new AppError('Cannot add messages to a closed ticket', 400, 'TICKET_CLOSED');
    }

    const message = await prisma.ticketMessage.create({
      data: {
        id: uuidv4(),
        ticketId,
        senderId,
        senderType,
        content: Sanitizer.sanitizeHtml(data.content),
        isInternal: data.isInternal || false,
      },
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            role: true,
          },
        },
      },
    });

    // Update ticket status if needed
    if (senderType === 'CUSTOMER' && ticket.status === 'WAITING_ON_CUSTOMER') {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'OPEN' as any },
      });
    }

    logger.info(`Message added to ticket: ${ticketId}`);

    return message;
  }

  public static async getAISummary(ticketId: string) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    if (!ticket.aiSummary && env.ENABLE_AI_FEATURES) {
      await queueManager.addJob(
        'ai-processing',
        'generate-summary',
        {
          type: 'ai-process',
          payload: { ticketId, action: 'summarize' },
        },
        { priority: 3 }
      );

      return { message: 'Summary generation in progress...' };
    }

    return {
      summary: ticket.aiSummary,
      sentiment: ticket.aiSentiment,
      suggestedAction: ticket.aiSuggestedAction,
      similarTickets: ticket.aiSimilarTickets,
    };
  }

  public static async findSimilarTickets(ticketId: string) {
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: { messages: { take: 1, orderBy: { createdAt: 'asc' } } },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket');
    }

    // Simple text-based similarity search
    const similarTickets = await prisma.supportTicket.findMany({
      where: {
        id: { not: ticketId },
        OR: [
          { subject: { contains: ticket.subject.split(' ').slice(0, 3).join(' '), mode: 'insensitive' } },
          { category: ticket.category || undefined },
        ],
        status: { not: 'CLOSED' as any },
      },
      select: {
        id: true,
        subject: true,
        status: true,
        createdAt: true,
      },
      take: 5,
    });

    return similarTickets;
  }

  public static async listAllTickets(
    filters: any,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const where: any = {};

    if (filters.status) where.status = filters.status as any;
    if (filters.priority) where.priority = filters.priority as any;
    if (filters.category) where.category = filters.category;
    if (filters.assignedTo) where.assignedTo = filters.assignedTo;
    if (filters.productId) where.productId = filters.productId;

    if (filters.search) {
      where.OR = [
        { subject: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: { id: true, fullName: true, email: true },
          },
          product: {
            select: { name: true, slug: true },
          },
          _count: { select: { messages: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(tickets, total, { page, limit });
  }
}