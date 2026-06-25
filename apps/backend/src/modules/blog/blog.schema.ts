import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  author: z.string().min(2),
  category: z.string().min(2),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
});

export const updateBlogSchema = createBlogSchema.partial();

export const addCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(1000),
});