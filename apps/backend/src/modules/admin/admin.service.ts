import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { NotFoundError } from '../../middleware/error-handler';
import { DashboardStats, SalesAnalytics } from './admin.types';
import { env } from '../../config/env';
import { InsightAgent } from '../../ai/agents/insight-agent';

export class AdminService {
  public static async getDashboardStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenueResult,
      activeLicenses,
      openTickets,
      newUsersThisMonth,
      revenueThisMonthResult,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { amountCents: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.license.count({ where: { status: 'ACTIVE' } }),
      prisma.supportTicket.count({
        where: { status: { not: 'CLOSED' } },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      prisma.order.aggregate({
        _sum: { amountCents: true },
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenueResult._sum.amountCents || 0,
      activeLicenses,
      openTickets,
      newUsersThisMonth,
      revenueThisMonth: revenueThisMonthResult._sum.amountCents || 0,
    };
  }

  public static async listUsers(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<any>> {
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const paginationParams = PaginationHelper.getPaginationParams({ page, limit });

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          emailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              licenses: true,
              supportTickets: true,
            },
          },
        },
        ...paginationParams,
      }),
      prisma.user.count({ where }),
    ]);

    return PaginationHelper.createPaginatedResponse(users, total, { page, limit });
  }

  public static async updateUserRole(userId: string, role: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: role as any },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    logger.info(`User role updated: ${user.email} -> ${role}`);

    return updated;
  }

  public static async getSalesAnalytics(): Promise<SalesAnalytics> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const totalRevenueResult = await prisma.order.aggregate({
      _sum: { amountCents: true },
      where: { status: 'COMPLETED' },
    });

    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    const monthlyOrders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: sixMonthsAgo },
      },
      select: {
        amountCents: true,
        createdAt: true,
      },
    });

    const topProducts = await prisma.order.groupBy({
      by: ['productId'],
      where: { status: 'COMPLETED' },
      _sum: { amountCents: true },
      _count: true,
      orderBy: { _sum: { amountCents: 'desc' } },
      take: 5,
    });

    // Get product names for top products
    const productIds = topProducts.map((p: { productId: any; }) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const productMap = new Map(products.map((p: { id: any; name: any; }) => [p.id, p.name]));

    // Aggregate monthly revenue
    const monthlyRevenue = new Map<string, { revenue: number; orders: number }>();

    monthlyOrders.forEach((order: { createdAt: { toISOString: () => string; }; amountCents: number; }) => {
      const month = order.createdAt.toISOString().substring(0, 7);
      const existing = monthlyRevenue.get(month) || { revenue: 0, orders: 0 };
      monthlyRevenue.set(month, {
        revenue: existing.revenue + order.amountCents,
        orders: existing.orders + 1,
      });
    });

    const revenueByMonth = Array.from(monthlyRevenue.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    const totalOrders = ordersByStatus.reduce((sum: any, s: { _count: any; }) => sum + s._count, 0);
    const totalRevenue = totalRevenueResult._sum.amountCents || 0;

    return {
      totalRevenue,
      ordersByStatus: ordersByStatus.reduce((acc: any, s: { status: any; _count: any; }) => ({
        ...acc,
        [s.status]: s._count,
      }), {}),
      revenueByMonth,
      topProducts: topProducts.map((p: { productId: unknown; _sum: { amountCents: any; }; _count: any; }) => ({
        name: productMap.get(p.productId) || 'Unknown',
        revenue: p._sum.amountCents || 0,
        orders: p._count,
      })),
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  }

  public static async getAIInsights() {
    if (!env.ENABLE_AI_FEATURES) {
      return {
        message: 'AI features are disabled',
        topTicketCategories: [],
        customerSatisfaction: 0,
        commonIssues: [],
        recommendations: [],
        predictedLicenseRenewals: 0,
      };
    }

    try {
      const agent = new InsightAgent();
      const insights = await agent.generateInsights();
      return insights;
    } catch (error) {
      logger.error({ error }, 'Failed to generate AI insights');
      return {
        topTicketCategories: [],
        customerSatisfaction: 0,
        commonIssues: [],
        recommendations: [],
        predictedLicenseRenewals: 0,
      };
    }
  }
}