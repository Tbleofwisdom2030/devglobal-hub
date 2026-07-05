import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

(prisma as any).$on('warn', (e: any) => {
  logger.warn({ err: e }, 'Prisma warning');
});

(prisma as any).$on('error', (e: any) => {
  logger.error({ err: e }, 'Prisma error');
});

export const database = {
  getInstance: () => prisma,
  connect: async () => {
    try {
      await prisma.$connect();
      logger.info('✅ Database connected successfully');
    } catch (error) {
      logger.error({ err: error }, '❌ Database connection failed');
      throw error;
    }
  },
  disconnect: async () => {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  },
  healthCheck: async (): Promise<boolean> => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  },
};