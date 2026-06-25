'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Key,
  ShoppingCart,
  Ticket,
  MessageSquare,
  User,
  Settings,
  Users,
  Package,
  BarChart3,
  BookOpen,
  ChevronLeft,
} from 'lucide-react';

const customerLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Licenses', href: '/dashboard/licenses', icon: Key },
  { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingCart },
  { name: 'Support Tickets', href: '/dashboard/tickets', icon: Ticket },
  { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const adminLinks = [
  { name: 'Admin Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Tickets', href: '/admin/tickets', icon: Ticket },
  { name: 'Knowledge Base', href: '/admin/knowledge', icon: BookOpen },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

interface SidebarProps {
  isAdmin?: boolean;
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300',
        isSidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
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
        </div>

        <div className="border-t p-2">
          <button
            onClick={toggleSidebar}
            className="flex w-full items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform',
                !isSidebarOpen && 'rotate-180'
              )}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}