'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { 
  Github, Twitter, Linkedin, Youtube, Instagram, 
  ArrowUp, Heart, Code2, Crown, Shield, Zap,
  Mail, MessageSquare, Sparkles, Users, Globe,
  Award, Star, Coffee
} from 'lucide-react';
import { useEffect, useState } from 'react';

type FooterLink = {
  name: string;
  href: string;
  icon?: LucideIcon;
};

const footerLinks: Record<'company' | 'support' | 'legal' | 'products', FooterLink[]> = {
  company: [
    { name: 'About', href: '/about', icon: Users },
    { name: 'Blog', href: '/blog', icon: Sparkles },
    { name: 'Contact', href: '/contact', icon: Mail },
  ],
  support: [
    { name: 'Documentation', href: '/docs', icon: Code2 },
    { name: 'API Reference', href: '/api', icon: Zap },
    { name: 'Support Tickets', href: '/dashboard/tickets', icon: MessageSquare },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'License Agreement', href: '/license' },
  ],
  products: [
    { name: 'DevFlow Pro', href: '/products/devflow-pro' },
    { name: 'CodeScope AI', href: '/products/codescope-ai' },
    { name: 'DeployMate', href: '/products/deploymate' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { name: 'YouTube', href: 'https://youtube.com', icon: Youtube },
  { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
];

// ============================================================
// 🎨 የኢትዮጵያ ፓተርን ኮምፖኔንት (Ethiopian Pattern)
// ============================================================
function EthiopianFooterPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
      {/* የኢትዮጵያ ጥልምም ፓተርን መሰረታዊ */}
      <div className="absolute inset-0 bg-ethiopian-diamonds" />
      <div className="absolute inset-0 bg-ethiopian-cross opacity-30" />
      
      {/* የወርቅ ነጠብጣቦች */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      
      {/* የኢትዮጵያ መስቀል ሞቲፍ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-gold-500/20 rotate-45" />
            <div className="absolute w-16 h-16 border-2 border-gold-500/20" />
            <div className="absolute w-8 h-8 border-2 border-gold-500/10 rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 🔙 ወደ ላይ ቡቶን (Back to Top Button)
// ============================================================
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 p-3 rounded-full 
                     bg-gradient-to-br from-gold-500 to-gold-600 
                     text-white shadow-glow-gold hover:shadow-glow-gold-lg
                     transition-all duration-300 hover:scale-110
                     border border-gold-400/30"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// 🎯 ዋናው ፉተር (Main Footer)
// ============================================================
export function Footer() {
  return (
    <footer className="relative border-t border-border-subtle bg-surface-primary/80 backdrop-blur-xl overflow-hidden">
      {/* የኢትዮጵያ ዳራ ፓተርን */}
      <EthiopianFooterPattern />

      {/* የጎልድ አክሰንት መስመር */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="container relative z-10 mx-auto px-4 py-16">
        {/* ===== ዋና ግሪድ (Main Grid) ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ===== ብራንድ አካባቢ (Brand Section) ===== */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Code2 className="w-5 h-5 text-white relative z-10" />
                    </motion.div>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xl font-cabinet">
                    <span className="gradient-text-ethiopian">DevGlobal</span>
                    <span className="text-text-primary"> Hub</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">Premium Platform</span>
                    <Crown className="w-3 h-3 text-gold-500" />
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-sm text-text-secondary max-w-md leading-relaxed"
            >
              AI-powered platform for independent developers to showcase, 
              sell, and support software products. Built with ❤️ for the 
              global developer community.
            </motion.p>

            {/* ሶሻል ሚዲያ አይከኖች (Social Icons) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-3 pt-2"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-surface-secondary hover:bg-gold-500/10 
                             border border-border-default hover:border-gold-500/30
                             text-text-secondary hover:text-gold-500
                             transition-all duration-300 group"
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </motion.a>
              ))}
            </motion.div>

            {/* የኢትዮጵያ ባጅ (Ethiopian Badge) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-3 pt-2"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
                <Star className="w-3.5 h-3.5 text-gold-500" />
                <span className="text-xs text-gold-500 font-medium">Ethiopian 🇪🇹</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-500/10 border border-forest-500/20">
                <Shield className="w-3.5 h-3.5 text-forest-500" />
                <span className="text-xs text-forest-500 font-medium">Secure</span>
              </div>
            </motion.div>
          </div>

          {/* ===== የኩባንያ አገናኞች (Company Links) ===== */}
          {Object.entries(footerLinks).map(([key, links], columnIndex) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (columnIndex + 1), duration: 0.5 }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider font-cabinet">
                {key === 'company' && 'Company'}
                {key === 'products' && 'Products'}
                {key === 'support' && 'Support'}
                {key === 'legal' && 'Legal'}
              </h3>
              
              {/* የኢትዮጵያ ዲኮሬቲቭ መስመር */}
              <div className="w-8 h-0.5 bg-gradient-to-r from-gold-500/50 to-gold-500/10 rounded-full" />
              
              <ul className="space-y-2.5">
                {links.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (columnIndex + 1) + 0.05 * index }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-text-secondary 
                                 hover:text-gold-500 transition-all duration-200"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500/20 group-hover:bg-gold-500 
                                       transition-colors duration-200 flex-shrink-0" />
                      {link.name}
                      {link.icon && (
                        <link.icon className="w-3 h-3 opacity-0 group-hover:opacity-100 
                                             transition-all duration-200 transform group-hover:translate-x-0.5" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ===== ፉተር አካፋይ (Footer Divider) ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="relative my-10"
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-surface-primary/80 backdrop-blur-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 rotate-45 bg-gold-500/30" />
          </div>
        </motion.div>

        {/* ===== ግርጌ ያለው አካባቢ (Bottom Section) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-tertiary">
            <span>
              &copy; {new Date().getFullYear()} DevGlobal Hub. All rights reserved.
            </span>
            <span className="hidden md:inline-block w-px h-4 bg-border-default" />
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-earth-500 animate-pulse" /> in Ethiopia
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <Link href="/privacy" className="hover:text-gold-500 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold-500 transition-colors">
              Terms
            </Link>
            <Link href="/license" className="hover:text-gold-500 transition-colors">
              License
            </Link>
            <Link href="/sitemap" className="hover:text-gold-500 transition-colors">
              Sitemap
            </Link>
          </div>
        </motion.div>

        {/* ===== የኢትዮጵያ ባንዲራ ቀለማት (Ethiopian Flag Colors) ===== */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-500 via-gold-500 to-earth-500 opacity-30" />
      </div>

      {/* ===== ወደ ላይ ቡቶን (Back to Top) ===== */}
      <BackToTop />
    </footer>
  );
}

// ============================================================
// 🔧 የሚያስፈልጉ አስመጪዎች (Required Imports)
// ============================================================
// Add these imports at the top of the file:
// import { useState, useEffect } from 'react';
// import { AnimatePresence } from 'framer-motion';