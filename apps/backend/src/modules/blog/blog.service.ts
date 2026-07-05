import { prisma } from '../../config/database';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { Sanitizer } from '../../utils/sanitizer';
import { NotFoundError, ConflictError } from '../../middleware/error-handler';
import { logger } from '../../config/logger';
import { v4 as uuidv4 } from 'uuid';

export class BlogService {
  public static async listPosts(page: number = 1, limit: number = 10, publishedOnly: boolean = true) {
    const where: any = {};
    if (publishedOnly) where.isPublished = true;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true, title: true, slug: true, excerpt: true, coverImage: true,
          author: true, category: true, tags: true, isPublished: true,
          likes: true, viewCount: true, createdAt: true,
          _count: { select: { comments: true } },
        },
        ...(PaginationHelper.getPaginationParams({ page, limit }) as any),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(posts, total, { page, limit });
  }

  public static async getPostBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        comments: {
          where: { isApproved: true },
          include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) throw new NotFoundError('Blog post');
    
    // Increment view count
    await prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });
    
    return post;
  }

  public static async createPost(data: any) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictError('Blog post with this slug already exists');

    const post = await prisma.blogPost.create({
      data: {
        id: uuidv4(),
        ...data,
        title: Sanitizer.sanitizePlainText(data.title),
        excerpt: data.excerpt ? Sanitizer.sanitizePlainText(data.excerpt) : null,
      },
    });

    logger.info(`Blog post created: ${post.title}`);
    return post;
  }

  public static async updatePost(id: string, data: any) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundError('Blog post');

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        ...(data.title && { title: Sanitizer.sanitizePlainText(data.title) }),
        ...(data.excerpt && { excerpt: Sanitizer.sanitizePlainText(data.excerpt) }),
      },
    });

    logger.info(`Blog post updated: ${updated.title}`);
    return updated;
  }

  public static async deletePost(id: string) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundError('Blog post');

    await prisma.blogPost.delete({ where: { id } });
    logger.info(`Blog post deleted: ${id}`);
  }

  public static async likePost(postId: string) {
    const post = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError('Blog post');

    return prisma.blogPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });
  }

  public static async addComment(postId: string, userId: string, content: string) {
    const post = await prisma.blogPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError('Blog post');

    const comment = await prisma.blogComment.create({
      data: {
        id: uuidv4(),
        postId,
        userId,
        content: Sanitizer.sanitizeHtml(content),
      },
      include: {
        user: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    return comment;
  }

  public static async getComments(postId: string) {
    return prisma.blogComment.findMany({
      where: { postId, isApproved: true },
      include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}