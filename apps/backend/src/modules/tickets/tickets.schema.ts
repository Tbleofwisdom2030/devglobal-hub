import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  category: z.string().max(50).optional(),
  productId: z.string().uuid().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const updateTicketSchema = z.object({
  subject: z.string().min(5).max(200).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.string().max(50).optional(),
  assignedTo: z.string().uuid().optional(),
});

export const addMessageSchema = z.object({
  content: z.string().min(1, 'Message is required').max(5000),
  isInternal: z.boolean().optional().default(false),
});

export const ticketFilterSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.string().optional(),
  productId: z.string().uuid().optional(),
  assignedTo: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});