import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { Sanitizer } from '../../utils/sanitizer';
import { NotFoundError, ConflictError } from '../../middleware/error-handler';
import { env } from '../../config/env';
import { EmbeddingService } from '../../ai/embeddings';
import { CreateArticleDTO, UpdateArticleDTO, SearchResult } from './kb.types';

import { v4 as uuidv4 } from 'uuid';

export class KnowledgeBaseService {
  public static async listArticles(
    filters: any,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const where: any = {
      isPublished: true,
    };

    if (filters.contentType) {
      where.contentType = filters.contentType;
    }

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.tag) {
      where.tags = { has: filters.tag };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.knowledgeBase.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          contentType: true,
          tags: true,
          isPublished: true,
          createdAt: true,
          updatedAt: true,
          product: {
            select: { name: true, slug: true },
          },
        },
        ...PaginationHelper.getPaginationParams({ page, limit }),
      }),
      prisma.knowledgeBase.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(articles, total, { page, limit });
  }

  public static async getArticleBySlug(slug: string) {
    const article = await prisma.knowledgeBase.findUnique({
      where: { slug },
      include: {
        product: {
          select: { name: true, slug: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundError('Article');
    }

    return article;
  }

  public static async createArticle(data: CreateArticleDTO) {
    // Check slug uniqueness
    const existing = await prisma.knowledgeBase.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      throw new ConflictError('Article with this slug already exists');
    }

    const article = await prisma.knowledgeBase.create({
      data: {
        id: uuidv4(),
        title: Sanitizer.sanitizePlainText(data.title),
        content: Sanitizer.sanitizeHtml(data.content),
        contentType: data.contentType,
        productId: data.productId || null,
        tags: data.tags || [],
        slug: data.slug,
        isPublished: data.isPublished ?? true,
      },
    });

    // Generate embeddings if AI is enabled
    if (env.ENABLE_AI_FEATURES) {
      try {
        await EmbeddingService.generateAndStoreEmbeddings(article.id, article.content);
        logger.info(`Embeddings generated for article: ${article.id}`);
      } catch (error) {
        logger.error({ error }, 'Failed to generate embeddings');
      }
    }

    logger.info(`Knowledge base article created: ${article.title}`);

    return article;
  }

  public static async updateArticle(id: string, data: UpdateArticleDTO) {
    const article = await prisma.knowledgeBase.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundError('Article');
    }

    const updated = await prisma.knowledgeBase.update({
      where: { id },
      data: {
        ...data,
        ...(data.title && { title: Sanitizer.sanitizePlainText(data.title) }),
        ...(data.content && { content: Sanitizer.sanitizeHtml(data.content) }),
      },
    });

    // Regenerate embeddings if content changed
    if (data.content && env.ENABLE_AI_FEATURES) {
      try {
        // Delete old embeddings
        await prisma.kbEmbedding.deleteMany({
          where: { kbArticleId: id },
        });

        // Generate new embeddings
        await EmbeddingService.generateAndStoreEmbeddings(id, data.content);
        logger.info(`Embeddings regenerated for article: ${id}`);
      } catch (error) {
        logger.error({ error }, 'Failed to regenerate embeddings');
      }
    }

    logger.info(`Knowledge base article updated: ${updated.title}`);

    return updated;
  }

  public static async deleteArticle(id: string) {
    const article = await prisma.knowledgeBase.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundError('Article');
    }

    // Delete embeddings first
    await prisma.kbEmbedding.deleteMany({
      where: { kbArticleId: id },
    });

    // Delete article
    await prisma.knowledgeBase.delete({
      where: { id },
    });

    logger.info(`Knowledge base article deleted: ${id}`);
  }

  public static async generateEmbeddings(articleId: string) {
    const article = await prisma.knowledgeBase.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundError('Article');
    }

    if (!env.ENABLE_AI_FEATURES) {
      throw new Error('AI features are disabled');
    }

    // Delete existing embeddings
    await prisma.kbEmbedding.deleteMany({
      where: { kbArticleId: articleId },
    });

    // Generate new embeddings
    await EmbeddingService.generateAndStoreEmbeddings(articleId, article.content);

    logger.info(`Embeddings generated for article: ${articleId}`);

    return { message: 'Embeddings generated successfully' };
  }

  public static async semanticSearch(
    query: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    if (!env.ENABLE_AI_FEATURES) {
      // Fallback to text search
      return this.textSearch(query, limit);
    }

    try {
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);

      // Search using pgvector cosine similarity
      const results = await prisma.$queryRaw<any[]>`
        SELECT 
          kbe.id,
          kbe.kb_article_id,
          kbe.chunk_text,
          kbe.chunk_index,
          1 - (kbe.embedding <=> ${queryEmbedding}::vector) AS similarity,
          kb.title,
          kb.slug,
          kb.content_type,
          kb.tags,
          p.name AS product_name
        FROM kb_embeddings kbe
        JOIN knowledge_base kb ON kb.id = kbe.kb_article_id
        LEFT JOIN products p ON p.id = kb.product_id
        WHERE kb.is_published = true
        ORDER BY similarity DESC
        LIMIT ${limit}
      `;

      return results.map((row: any) => ({
        article: {
          id: row.kb_article_id,
          title: row.title,
          slug: row.slug,
          contentType: row.content_type,
          tags: row.tags,
          productName: row.product_name,
        },
        relevance: Math.round(row.similarity * 100) / 100,
        snippet: row.chunk_text.substring(0, 200) + '...',
      }));
    } catch (error) {
      logger.error({ error }, 'Semantic search failed');
      return this.textSearch(query, limit);
    }
  }

  private static async textSearch(
    query: string,
    limit: number = 5
  ): Promise<SearchResult[]> {
    const articles = await prisma.knowledgeBase.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { hasSome: [query] } },
        ],
      },
      include: {
        product: {
          select: { name: true },
        },
      },
      take: limit,
    });

    return articles.map((article: { id: any; title: any; slug: any; contentType: any; tags: any; product: { name: any; }; content: string; }) => ({
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        contentType: article.contentType,
        tags: article.tags,
        productName: article.product?.name,
      },
      relevance: 0.5,
      snippet: article.content.substring(0, 200) + '...',
    }));
  }
}