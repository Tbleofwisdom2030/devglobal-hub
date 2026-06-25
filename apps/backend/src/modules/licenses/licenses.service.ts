import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { NotFoundError, AppError } from '../../middleware/error-handler';
import { LicenseValidationResult } from './licenses.types';
import { v4 as uuidv4 } from 'uuid';

const LicenseGenerator = {
  generateLicenseKey: (productSlug: string, userId: string) => {
    const raw = `${productSlug}-${userId}-${uuidv4()}`;
    return raw.toUpperCase();
  },
  validateLicenseFormat: (licenseKey: string) => {
    return /^[A-Z0-9-]+$/.test(licenseKey);
  },
};

export class LicenseService {
  public static async generateLicense(
    orderId: string,
    userId: string,
    productId: string
  ) {
    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError('Product');
    }

    // Generate license key
    const licenseKey = LicenseGenerator.generateLicenseKey(product.slug, userId);

    // Create license
    const license = await prisma.license.create({
      data: {
        id: uuidv4(),
        userId,
        productId,
        orderId,
        licenseKey,
        status: 'ACTIVE',
        maxActivations: 3,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    logger.info(`License generated: ${licenseKey}`);

    return license;
  }

  public static async listUserLicenses(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const [licenses, total] = await Promise.all([
      prisma.license.findMany({
        where: { userId },
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              imageUrls: true,
              version: true,
            },
          },
        },
        ...PaginationHelper.getPaginationParams({ page, limit }),
      }),
      prisma.license.count({ where: { userId } }),
    ]);

    return PaginationHelper.createPaginatedResponse(licenses, total, { page, limit });
  }

  public static async getLicenseById(licenseId: string, userId?: string) {
    const where: any = { id: licenseId };
    if (userId) {
      where.userId = userId;
    }

    const license = await prisma.license.findFirst({
      where,
      include: {
        product: {
          select: {
            name: true,
            slug: true,
            description: true,
            imageUrls: true,
            version: true,
            downloadUrl: true,
          },
        },
        order: {
          select: {
            amountCents: true,
            currency: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!license) {
      throw new NotFoundError('License');
    }

    return license;
  }

  public static async validateLicense(
    licenseKey: string,
    productSlug?: string
  ): Promise<LicenseValidationResult> {
    // Validate format
    if (!LicenseGenerator.validateLicenseFormat(licenseKey)) {
      return {
        valid: false,
        error: 'Invalid license key format',
        code: 'INVALID_FORMAT',
      };
    }

    // Find license
    const license = await prisma.license.findUnique({
      where: { licenseKey },
      include: {
        product: {
          select: { name: true, slug: true, isActive: true },
        },
        user: {
          select: { email: true },
        },
      },
    });

    if (!license) {
      return {
        valid: false,
        error: 'License not found',
        code: 'NOT_FOUND',
      };
    }

    // Check product slug if provided
    if (productSlug && license.product.slug !== productSlug) {
      return {
        valid: false,
        error: 'License does not match the specified product',
        code: 'PRODUCT_MISMATCH',
      };
    }

    // Check product is active
    if (!license.product.isActive) {
      return {
        valid: false,
        error: 'Product is no longer available',
        code: 'PRODUCT_INACTIVE',
      };
    }

    // Check license status
    if (license.status === 'EXPIRED') {
      return {
        valid: false,
        error: 'License has expired',
        code: 'EXPIRED',
      };
    }

    if (license.status === 'REVOKED') {
      return {
        valid: false,
        error: `License has been revoked: ${license.revokedReason || 'No reason provided'}`,
        code: 'REVOKED',
      };
    }

    // Check expiration
    if (license.expiresAt && license.expiresAt < new Date()) {
      await prisma.license.update({
        where: { id: license.id },
        data: { status: 'EXPIRED' },
      });

      return {
        valid: false,
        error: 'License has expired',
        code: 'EXPIRED',
      };
    }

    // Update last validated
    await prisma.license.update({
      where: { id: license.id },
      data: { lastValidatedAt: new Date() },
    });

    return {
      valid: true,
      license: {
        id: license.id,
        licenseKey: license.licenseKey,
        status: license.status,
        productId: license.productId,
        productName: license.product.name,
        maxActivations: license.maxActivations,
        activationCount: license.activationCount,
        expiresAt: license.expiresAt || undefined,
      },
    };
  }

  public static async activateLicense(licenseId: string, deviceId: string) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundError('License');
    }

    if (license.status !== 'ACTIVE') {
      throw new AppError(
        `Cannot activate license with status: ${license.status}`,
        400,
        'LICENSE_INACTIVE'
      );
    }

    if (license.activationCount >= license.maxActivations) {
      throw new AppError(
        'Maximum activations reached',
        400,
        'MAX_ACTIVATIONS'
      );
    }

    const updated = await prisma.license.update({
      where: { id: licenseId },
      data: {
        activationCount: { increment: 1 },
        activatedAt: license.activatedAt || new Date(),
      },
    });

    logger.info(`License activated: ${license.licenseKey} on device ${deviceId}`);

    return updated;
  }

  public static async revokeLicense(
    licenseId: string,
    reason: string
  ) {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
    });

    if (!license) {
      throw new NotFoundError('License');
    }

    if (license.status === 'REVOKED') {
      throw new AppError('License is already revoked', 400, 'ALREADY_REVOKED');
    }

    const updated = await prisma.license.update({
      where: { id: licenseId },
      data: {
        status: 'REVOKED',
        revokedReason: reason,
      },
    });

    logger.info(`License revoked: ${license.licenseKey}. Reason: ${reason}`);

    return updated;
  }

  public static async checkExpiredLicenses() {
    const expiredLicenses = await prisma.license.updateMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    if (expiredLicenses.count > 0) {
      logger.info(`Expired ${expiredLicenses.count} licenses`);
    }
  }
}