import { z } from 'zod';

export const productFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().max(100).optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  tags: z.array(z.string()).optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(50).optional().default(12),
  sortBy: z.enum(['name', 'priceCents', 'createdAt', 'category']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type ProductFilterData = z.infer<typeof productFilterSchema>;