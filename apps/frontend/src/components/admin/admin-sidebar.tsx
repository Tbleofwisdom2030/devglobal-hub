'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Package, Plus, FileText, Users, Ticket,
  BookOpen, Globe, Image, BarChart3, Settings, ChevronLeft, ShoppingCart
} from 'lucide-react';

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'New Product', href: '/admin/products/new', icon: Plus },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
  { name: 'Knowledge Base', href: '/admin/knowledge', icon: BookOpen },
  { name: 'Landing Page', href: '/admin/landing', icon: Globe },
  { name: 'Media Library', href: '/admin/media', icon: Image },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
      isSidebarOpen ? 'w-64' : 'w-16'
    )}>
      <div className="flex items-center h-16 px-4 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">DG</span>
          </div>
          {isSidebarOpen && <span className="font-bold text-lg">Admin</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                !isSidebarOpen && 'justify-center'
              )}
              title={!isSidebarOpen ? link.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-3">{link.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-2">
        <button onClick={toggleSidebar} className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent">
          <ChevronLeft className={cn('h-5 w-5 transition-transform', !isSidebarOpen && 'rotate-180')} />
        </button>
      </div>
    </aside>
  );
}