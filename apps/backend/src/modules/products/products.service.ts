import { prisma } from '../../config/database';
import { Sanitizer } from '../../utils/sanitizer';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { logger } from '../../config/logger';
import { NotFoundError, ConflictError } from '../../middleware/error-handler';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export class ProductsService {
  static getProductStats(id: string) {
    throw new Error('Method not implemented.');
  }
  public static async listProducts(
    filters: any,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResponse<any>> {
    const where: Prisma.ProductWhereInput = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { tags: { hasSome: [filters.search] } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(products, total, { page, limit });
  }

  public static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  public static async getProductById(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  public static async createProduct(data: any) {
    // Check slug
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) throw new ConflictError('Product with this slug already exists');

    try {
      const product = await prisma.product.create({
        data: {
          id: uuidv4(),
          slug: data.slug,
          name: Sanitizer.sanitizePlainText(data.name),
          description: data.description ? Sanitizer.sanitizeHtml(data.description) : null,
          longDescription: data.longDescription ? Sanitizer.sanitizeHtml(data.longDescription) : null,
          priceCents: data.priceCents || 0,
          currency: data.currency || 'USD',
          category: data.category || null,
          tags: Array.isArray(data.tags) ? data.tags : [],
          imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
          coverImage: data.coverImage || null,
          gallery: Array.isArray(data.gallery) ? data.gallery : [],
          features: data.features || [],
          downloadUrl: data.downloadUrl || null,
          version: data.version || null,
          isActive: data.isActive ?? true,
          stripePriceId: data.stripePriceId || null,
          changelog: data.changelog || null,
        },
      });

      logger.info(`Product created: ${product.name} (${product.slug})`);
      return product;
    } catch (error) {
      logger.error(`Failed to create product: ${String(error)}`);
      throw error;
    }
  }

  public static async updateProduct(id: string, data: any) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = Sanitizer.sanitizePlainText(data.name);
    if (data.description !== undefined) updateData.description = data.description ? Sanitizer.sanitizeHtml(data.description) : null;
    if (data.longDescription !== undefined) updateData.longDescription = data.longDescription ? Sanitizer.sanitizeHtml(data.longDescription) : null;
    if (data.priceCents !== undefined) updateData.priceCents = data.priceCents;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = Array.isArray(data.tags) ? data.tags : [];
    if (data.imageUrls !== undefined) updateData.imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
    if (data.gallery !== undefined) updateData.gallery = Array.isArray(data.gallery) ? data.gallery : [];
    if (data.features !== undefined) updateData.features = data.features;
    if (data.downloadUrl !== undefined) updateData.downloadUrl = data.downloadUrl;
    if (data.version !== undefined) updateData.version = data.version;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.stripePriceId !== undefined) updateData.stripePriceId = data.stripePriceId;
    if (data.changelog !== undefined) updateData.changelog = data.changelog;

    const updated = await prisma.product.update({ where: { id }, data: updateData });
    logger.info(`Product updated: ${updated.name}`);
    return updated;
  }

  public static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundError('Product');
    await prisma.product.delete({ where: { id } });
    logger.info(`Product deleted: ${id}`);
  }
}