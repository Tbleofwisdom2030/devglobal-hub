export const APP_NAME = 'DevGlobal Hub';
export const APP_DESCRIPTION = 'AI-Powered Software Development Platform';
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SUPPORT: 'SUPPORT',
} as const;

export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  WAITING_ON_CUSTOMER: 'WAITING_ON_CUSTOMER',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
} as const;

export const TICKET_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

export const LICENSE_STATUS = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED',
} as const;

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export const NAVIGATION = {
  HOME: '/',
  PRODUCTS: '/products',
  BLOG: '/blog',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  LICENSES: '/dashboard/licenses',
  ORDERS: '/dashboard/orders',
  TICKETS: '/dashboard/tickets',
  CHAT: '/dashboard/chat',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  ADMIN: '/admin',
};