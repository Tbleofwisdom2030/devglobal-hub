import { prisma } from '../../config/database';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { NotFoundError } from '../../middleware/error-handler';
import { StorageService } from '../../services/storage-service';
import { logger } from '../../config/logger';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

export class MediaService {
  public static async uploadFile(file: Express.Multer.File, userId: string) {
    let buffer = file.buffer;
    let width: number | undefined;
    let height: number | undefined;

    // Get image dimensions if applicable
    if (file.mimetype.startsWith('image/')) {
      try {
        const metadata = await sharp(buffer).metadata();
        width = metadata.width;
        height = metadata.height;
        
        // Optimize images
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          buffer = await sharp(buffer)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
        }
      } catch (error) {
        logger.warn(`Failed to get image metadata: ${String(error)}`);
      }
    }

    const filename = `${uuidv4()}-${file.originalname}`;
    const url = await StorageService.uploadFile(buffer, filename, file.mimetype, 'media');

    const media = await prisma.media.create({
      data: {
        id: uuidv4(),
        filename: file.originalname,
        url,
        mimeType: file.mimetype,
        size: file.size,
        width,
        height,
        uploadedBy: userId,
      },
    });

    logger.info(`Media uploaded: ${filename}`);
    return media;
  }

  public static async listMedia(page: number = 1, limit: number = 50, type?: string) {
    const where: any = {};
    if (type) where.mimeType = { startsWith: type };

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        ...PaginationHelper.getPaginationParams({ page, limit }),
      }),
      prisma.media.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(media, total, { page, limit });
  }

  public static async deleteMedia(id: string) {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundError('Media');

    // Delete from storage
    try {
      const key = media.url.split('/').pop();
      if (key) await StorageService.deleteFile(key);
    } catch (error) {
      logger.warn('Failed to delete file from storage:', error);
    }

    await prisma.media.delete({ where: { id } });
    logger.info(`Media deleted: ${id}`);
  }
}