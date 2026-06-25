import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10).max(50000),
  contentType: z.enum(['FAQ', 'DOCUMENTATION', 'BLOG', 'TUTORIAL']),
  productId: z.string().uuid().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  slug: z.string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  isPublished: z.boolean().optional().default(true),
});

export const updateArticleSchema = createArticleSchema.partial().omit({ slug: true });

export const searchSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.coerce.number().int().min(1).max(20).optional().default(5),
});

export const articleFilterSchema = z.object({
  contentType: z.enum(['FAQ', 'DOCUMENTATION', 'BLOG', 'TUTORIAL']).optional(),
  productId: z.string().uuid().optional(),
  tag: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});