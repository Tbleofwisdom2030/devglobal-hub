import { z } from 'zod';

export const createProductSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(100, 'Slug is too long')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens'
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(200, 'Name is too long'),
  description: z.string().max(500).optional().nullable(),
  longDescription: z.string().max(5000).optional().nullable(),
  priceCents: z.number().int().min(0, 'Price cannot be negative'),
  currency: z.string().length(3).default('USD'),
  category: z.string().max(50).optional().nullable(),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  imageUrls: z.array(z.string()).max(10).optional().default([]),
  coverImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().default([]),
  features: z.any().optional(),
  downloadUrl: z.string().optional().nullable(),
  version: z.string().max(20).optional().nullable(),
  isActive: z.boolean().optional().default(true),
  stripePriceId: z.string().max(100).optional().nullable(),
  changelog: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial().omit({ slug: true });

export const productFilterSchema = z.object({
  category: z.string().optional(),
  search: z.string().max(100).optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
  tags: z.array(z.string()).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'priceCents', 'createdAt', 'category']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});