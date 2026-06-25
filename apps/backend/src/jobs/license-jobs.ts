// License expiry checks
// TODO: Add license jobs
import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { LicenseService } from '../modules/licenses/licenses.service';
import { EmailService } from '../services/email-service';
import { prisma } from '../config/database';

export class LicenseWorker {
  public static async process(job: Job): Promise<void> {
    logger.info('Processing license job...');

    try {
      await LicenseService.checkExpiredLicenses();
      
      // Notify users with expiring licenses
      await LicenseWorker.notifyExpiringLicenses();

      logger.info('License job completed');
    } catch (error) {
      logger.error({ error }, 'License job failed');
      throw error;
    }
  }

  private static async notifyExpiringLicenses(): Promise<void> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringLicenses = await prisma.license.findMany({
      where: {
        status: 'ACTIVE',
        expiresAt: {
          lte: thirtyDaysFromNow,
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: { email: true, fullName: true },
        },
        product: {
          select: { name: true },
        },
      },
    });

    for (const license of expiringLicenses) {
      await EmailService.sendLicenseExpiringEmail(
        license.user.email,
        {
          name: license.user.fullName || 'Customer',
          productName: license.product.name,
          licenseKey: license.licenseKey,
          expiresAt: license.expiresAt,
        }
      );
    }

    logger.info(`Sent ${expiringLicenses.length} license expiry notifications`);
  }
}