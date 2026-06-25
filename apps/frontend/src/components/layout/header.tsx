// Responsive header with nav
// TODO: Add header component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@devglobal/ui';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  Ticket,
  MessageSquare,
  Key,
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { isMobileNavOpen, toggleMobileNav } = useUIStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">DG</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">
            DevGlobal Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span>{user?.fullName || 'User'}</span>
              </button>

              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover shadow-lg z-20">
                    <div className="p-2">
                      <p className="px-2 py-1.5 text-sm font-medium">
                        {user?.fullName}
                      </p>
                      <p className="px-2 pb-2 text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                      <div className="border-t my-1" />
                      <Link
                        href="/dashboard"
                        className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/licenses"
                        className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Key className="mr-2 h-4 w-4" />
                        My Licenses
                      </Link>
                      <Link
                        href="/dashboard/tickets"
                        className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Ticket className="mr-2 h-4 w-4" />
                        Support Tickets
                      </Link>
                      <Link
                        href="/dashboard/chat"
                        className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        AI Chat
                      </Link>
                      <div className="border-t my-1" />
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      <div className="border-t my-1" />
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={toggleMobileNav}
        >
          {isMobileNavOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:bg-accent'
                }`}
                onClick={toggleMobileNav}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t pt-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
                    onClick={toggleMobileNav}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      toggleMobileNav();
                      logout();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-accent"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-2 px-3">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href="/login" onClick={toggleMobileNav}>
                      Log in
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href="/register" onClick={toggleMobileNav}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}