// Responsive header with Ethiopian premium design
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@devglobal/ui';
import { useAuth } from '@/hooks/use-auth';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@devglobal/ui';
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
  Search,
  Bell,
  Sparkles,
  Crown,
  ChevronDown,
  Globe,
  Code2,
  Gift,
  Zap,
  Shield,
  Award,
  Users,
  Star,
  Moon,
  Sun,
} from 'lucide-react';

// ============================================================
// 🎨 የኢትዮጵያ ፓተርን ኮምፖኔንት (Ethiopian Pattern Component)
// ============================================================
function EthiopianPatternLine() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none">
      <div className="h-full bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
      <div className="absolute inset-0 h-full bg-gradient-to-r from-forest-500/20 via-gold-500/40 to-earth-500/20 blur-sm" />
    </div>
  );
}

// ============================================================
// 🔔 የማሳወቂያ ቤል ኮምፖኔንት (Notification Bell)
// ============================================================
function NotificationBell({ hasNotifications = true }: { hasNotifications?: boolean }) {
  return (
    <motion.button
      className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Bell className="w-5 h-5 text-text-secondary" />
      {hasNotifications && (
        <>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-earth-500 rounded-full animate-pulse" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-earth-500 rounded-full animate-ping opacity-75" />
        </>
      )}
    </motion.button>
  );
}

// ============================================================
// 🔍 የፍለጋ ኮምፖኔንት (Search Component)
// ============================================================
function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <motion.div
      className="relative"
      animate={{ width: isExpanded ? '240px' : '40px' }}
      transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <motion.button
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-surface-hover transition-colors z-10"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Search className="w-4 h-4 text-text-secondary" />
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-secondary border border-border-default 
                       focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 outline-none
                       text-sm text-text-primary placeholder:text-text-tertiary/60
                       transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* የኢትዮጵያ ፓተርን በፍለጋ ጠርዝ */}
      {isExpanded && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500/20 via-gold-500/50 to-gold-500/20" />
      )}
    </motion.div>
  );
}

// ============================================================
// 🎯 የአሳሽ አገናኞች (Navigation Links)
// ============================================================
const navigation = [
  { name: 'Home', href: '/', icon: Star },
  { name: 'Products', href: '/products', icon: Code2 },
  { name: 'Blog', href: '/blog', icon: Sparkles },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Contact', href: '/contact', icon: MessageSquare },
];

// ============================================================
// 🏗️ ዋናው ሄደር (Main Header)
// ============================================================
export function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { isMobileNavOpen, toggleMobileNav } = useUIStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // ===== ስክሮል ዳሰሳ (Scroll Detection) =====
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ===== የውጭ ጠቅታ ዳሰሳ (Click Outside) =====
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ===== የቀለም ሁነታ መቀየሪያ =====
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-surface-primary/80 backdrop-blur-xl border-b border-border-subtle shadow-premium-sm" 
          : "bg-transparent border-b border-border-default/20"
      )}
      style={{
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur}px)`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {/* የኢትዮጵያ ጥልምም መስመር (Ethiopian Pattern Line) */}
      <EthiopianPatternLine />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* ===== ሎጎ (Logo) ===== */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link href="/" className="flex items-center space-x-2 group">
            {/* የኢትዮጵያ ወርቅ ሎጎ አይከን */}
            <div className="relative h-9 w-9 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600" />
              <div className="absolute inset-0 bg-gradient-to-br from-forest-500/20 via-transparent to-earth-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Code2 className="w-5 h-5 text-white relative z-10" />
                </motion.div>
              </div>
              {/* የጎልድ ግሎው */}
              <div className="absolute inset-0 rounded-xl shadow-glow-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            <div className="flex flex-col">
              <span className="font-bold text-lg font-cabinet tracking-tight hidden sm:inline-block">
                <span className="gradient-text-ethiopian">DevGlobal</span>
                <span className="text-text-primary"> Hub</span>
              </span>
              <span className="text-[10px] text-text-tertiary hidden sm:inline-block font-medium tracking-wider uppercase">
                Premium Platform
              </span>
            </div>

            {/* ፕሪሚየም ባጅ */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20 ml-1">
              <Crown className="w-3 h-3 text-gold-500" />
              <span className="text-[10px] text-gold-500 font-medium">Premium</span>
            </div>
          </Link>
        </motion.div>

        {/* ===== ዴስክቶፕ አሳሽ (Desktop Navigation) ===== */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    "flex items-center gap-2",
                    isActive
                      ? "text-gold-500 bg-gold-500/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-hover/50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
                {/* ንቁ የሆነ አገናኝ አመልካች */}
                {isActive && (
                  <motion.div
                    className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500/50 via-gold-500 to-gold-500/50"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            );
          })}
        </nav>

        {/* ===== ዴስክቶፕ አክሽኖች (Desktop Actions) ===== */}
        <div className="hidden md:flex items-center space-x-2">
          {/* ፍለጋ */}
          <SearchBar />

          {/* ማሳወቂያ */}
          <NotificationBell />

          {/* ቀለም መቀየሪያ */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-text-secondary" />
            ) : (
              <Moon className="w-4 h-4 text-text-secondary" />
            )}
          </motion.button>

          {/* የተጠቃሚ ምናሌ (User Menu) */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300",
                  "hover:bg-surface-hover group",
                  isUserMenuOpen && "bg-surface-hover"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* የተጠቃሚ አቫታር (User Avatar) */}
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  {/* ኦንላይን አመልካች */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-forest-500 rounded-full border-2 border-surface-primary" />
                </div>
                
                <span className="text-sm font-medium text-text-primary hidden lg:inline-block">
                  {user?.fullName || 'User'}
                </span>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </motion.div>
              </motion.button>

              {/* ተቆልቋይ ምናሌ (Dropdown Menu) */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-surface-raised border border-border-subtle shadow-premium-lg overflow-hidden"
                  >
                    <div className="p-3">
                      {/* የተጠቃሚ መረጃ */}
                      <div className="flex items-center gap-3 pb-3 border-b border-border-default">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">
                            {user?.fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {user?.fullName || 'User'}
                          </p>
                          <p className="text-xs text-text-tertiary truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/20">
                          <span className="text-[10px] text-gold-500 font-medium">Pro</span>
                        </div>
                      </div>

                      {/* ምናሌ አይተሞች */}
                      <div className="py-2 space-y-1">
                        {[
                          { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
                          { name: 'My Licenses', href: '/dashboard/licenses', icon: Key },
                          { name: 'Support Tickets', href: '/dashboard/tickets', icon: Ticket },
                          { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 group"
                          >
                            <item.icon className="w-4 h-4 text-text-tertiary group-hover:text-gold-500 transition-colors" />
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-border-default pt-2 space-y-1">
                        {[
                          { name: 'Profile', href: '/dashboard/profile', icon: User },
                          { name: 'Settings', href: '/dashboard/settings', icon: Settings },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 group"
                          >
                            <item.icon className="w-4 h-4 text-text-tertiary group-hover:text-gold-500 transition-colors" />
                            {item.name}
                          </Link>
                        ))}
                        
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-earth-500 hover:text-earth-600 hover:bg-earth-500/10 transition-all duration-200 group"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            // ያልተገባ ተጠቃሚ (Unauthenticated)
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="font-medium">
                <Link href="/login">Log in</Link>
              </Button>
              <Button 
                size="sm" 
                asChild 
                className="relative overflow-hidden group bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
              >
                <Link href="/register">
                  <span className="relative z-10">Sign up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Gift className="w-3.5 h-3.5 ml-1 relative z-10" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* ===== ሞባይል ምናሌ ቡቶን (Mobile Menu Button) ===== */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors relative"
          onClick={toggleMobileNav}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMobileNavOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6 text-text-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6 text-text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ===== ሞባይል አሳሽ (Mobile Navigation) ===== */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="md:hidden border-t border-border-subtle bg-surface-primary/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {/* የኢትዮጵያ ፓተርን አካፋይ */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
              
              {navigation.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300",
                        isActive
                          ? "text-gold-500 bg-gold-500/10"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                      )}
                      onClick={toggleMobileNav}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                      {isActive && (
                        <motion.div
                          className="ml-auto w-1.5 h-8 bg-gradient-to-b from-gold-500/50 to-gold-500 rounded-full"
                          layoutId="mobileActiveNav"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent my-2" />

              {/* ሞባይል ተጠቃሚ አክሽኖች */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-300"
                    onClick={toggleMobileNav}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      toggleMobileNav();
                      logout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-earth-500 hover:text-earth-600 hover:bg-earth-500/10 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3 px-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    className="flex-1 border-gold-500/20 hover:border-gold-500/40"
                  >
                    <Link href="/login" onClick={toggleMobileNav}>
                      Log in
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className="flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700"
                  >
                    <Link href="/register" onClick={toggleMobileNav}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}

              {/* ሞባይል ፉተር */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-border-default">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-text-tertiary" />
                  <span className="text-xs text-text-tertiary">Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-text-tertiary" />
                  <span className="text-xs text-text-tertiary">Global</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-text-secondary" />
                  ) : (
                    <Moon className="w-4 h-4 text-text-secondary" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}