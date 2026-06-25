// Database cleanup
// TODO: Add cleanup jobs
import { Job } from 'bullmq';
import { logger } from '../config/logger';
import { prisma } from '../config/database';

export class CleanupWorker {
  public static async process(job: Job): Promise<void> {
    logger.info('Processing cleanup job...');

    try {
      await CleanupWorker.cleanupExpiredTokens();
      await CleanupWorker.cleanupOldAuditLogs();
      await CleanupWorker.cleanupArchivedConversations();

      logger.info('Cleanup job completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Cleanup job failed: ${message}`);
      throw error;
    }
  }

  private static async cleanupExpiredTokens(): Promise<void> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true },
        ],
      },
    });

    logger.info(`Cleaned up ${result.count} expired/revoked tokens`);
  }

  private static async cleanupOldAuditLogs(): Promise<void> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: { lt: sixMonthsAgo },
      },
    });

    logger.info(`Cleaned up ${result.count} old audit logs`);
  }

  private static async cleanupArchivedConversations(): Promise<void> {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const result = await prisma.chatConversation.updateMany({
      where: {
        status: 'ARCHIVED',
        updatedAt: { lt: threeMonthsAgo },
      },
      data: {
        status: 'CLOSED',
      },
    });

    logger.info(`Closed ${result.count} archived conversations`);
  }
}