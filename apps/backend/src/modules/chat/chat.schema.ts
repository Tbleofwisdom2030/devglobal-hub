import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().max(200).optional(),
  productId: z.string().uuid().optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message is required').max(4000),
});

export const conversationFilterSchema = z.object({
  status: z.enum(['ACTIVE', 'CLOSED', 'ARCHIVED']).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});