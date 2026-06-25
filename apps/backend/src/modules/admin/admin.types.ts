export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeLicenses: number;
  openTickets: number;
  newUsersThisMonth: number;
  revenueThisMonth: number;
}

export interface SalesAnalytics {
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  revenueByMonth: Array<{ month: string; revenue: number; orders: number }>;
  topProducts: Array<{ name: string; revenue: number; orders: number }>;
  averageOrderValue: number;
}

export interface AIInsights {
  topTicketCategories: Array<{ category: string; count: number }>;
  customerSatisfaction: number;
  commonIssues: string[];
  recommendations: string[];
  predictedLicenseRenewals: number;
}