import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'N/A';
    return format(d, 'MMM d, yyyy');
  } catch {
    return 'N/A';
  }
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'N/A';
    return format(d, 'MMM d, yyyy h:mm a');
  } catch {
    return 'N/A';
  }
}

export function formatTimeAgo(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'N/A';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return 'N/A';
  }
}

export function formatPrice(cents: number | null | undefined, currency: string = 'USD'): string {
  if (!cents && cents !== 0) return '$0.00';
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${(cents / 100).toFixed(2)}`;
}

export function truncate(str: string | null | undefined, length: number = 100): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPEN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    WAITING_ON_CUSTOMER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    RESOLVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    CLOSED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    EXPIRED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    REVOKED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    FAILED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
}