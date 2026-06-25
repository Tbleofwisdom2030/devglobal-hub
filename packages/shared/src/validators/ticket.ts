import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.string().max(50).optional(),
  productId: z.string().uuid().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const addMessageSchema = z.object({
  content: z.string().min(1, 'Message is required').max(5000),
  isInternal: z.boolean().optional(),
});

export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
export type AddMessageFormData = z.infer<typeof addMessageSchema>;