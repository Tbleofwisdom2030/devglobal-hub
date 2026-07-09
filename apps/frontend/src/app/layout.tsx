import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
// @ts-ignore
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@devglobal/ui';
// @ts-ignore
import { Analytics } from '@vercel/analytics/react';
// @ts-ignore
import { SpeedInsights } from '@vercel/speed-insights/next';

// ============================================================
// 🔤 ፕሪሚየም ፎንቶች (Premium Fonts)
// ============================================================
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// ============================================================
// 📝 ሜታዳታ (Metadata)
// ============================================================
export const metadata: Metadata = {
  title: {
    default: 'DevGlobal Hub - AI-Powered Developer Platform',
    template: '%s | DevGlobal Hub',
  },
  description:
    'DevGlobal Hub is an AI-powered platform for independent developers to showcase, sell, and support software products.',
  keywords: [
    'developer platform',
    'AI-powered',
    'software marketplace',
    'independent developers',
    'Ethiopian tech',
    'global developers',
  ],
  authors: [{ name: 'DevGlobal Hub Team' }],
  creator: 'DevGlobal Hub',
  publisher: 'DevGlobal Hub',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devglobalhub.com',
    siteName: 'DevGlobal Hub',
    title: 'DevGlobal Hub - AI-Powered Developer Platform',
    description:
      'DevGlobal Hub is an AI-powered platform for independent developers to showcase, sell, and support software products.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DevGlobal Hub - AI-Powered Developer Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevGlobal Hub - AI-Powered Developer Platform',
    description:
      'DevGlobal Hub is an AI-powered platform for independent developers to showcase, sell, and support software products.',
    images: ['/og-image.png'],
    creator: '@devglobalhub',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
  },
};

// ============================================================
// 🎨 የኢትዮጵያ ፓተርን ኮምፖኔንት (Ethiopian Pattern Background)
// ============================================================
function EthiopianBackground() {
  return (
    <>
      {/* የዳራ ፓተርን - የተለያዩ የኢትዮጵያ ጥልምም ቅርጾች */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* መሰረታዊ ግራዲየንት ዳራ */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-primary" />
        
        {/* የኢትዮጵያ ጥልምም ፓተርን ንብርብሮች */}
        <div className="absolute inset-0 bg-ethiopian-diamonds opacity-30" />
        <div className="absolute inset-0 bg-ethiopian-cross opacity-20" />
        <div className="absolute inset-0 bg-ethiopian-tessellation opacity-10" />
        
        {/* የወርቅ ነጠብጣቦች - አኒሜሽን ያላቸው */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-forest-500/5 blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-earth-500/3 blur-3xl" />
        
        {/* የሚያብረቀርቅ ነጠብጣብ - ዘገምተኛ አኒሜሽን */}
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-gold-500/20 rounded-full animate-pulse-glow" />
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-forest-500/20 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-earth-500/20 rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* የተንሳፋፊ ጂኦሜትሪክ ቅርጾች */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-12 h-12 border-2 border-gold-500/10 rounded-lg rotate-12 animate-float" style={{ animationDelay: '-1s' }} />
        <div className="absolute bottom-40 left-20 w-8 h-8 border-2 border-forest-500/10 rounded-full animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 right-40 w-16 h-16 border-2 border-earth-500/10 rotate-45 animate-float" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-6 h-6 border-2 border-gold-500/10 rotate-12 animate-float" style={{ animationDelay: '-2s' }} />
      </div>

      {/* የኢትዮጵያ መስቀል ሞቲፍ - በማዕከል አካባቢ */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.02]">
        <div className="w-[800px] h-[800px] relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-gold-500/30 rotate-45" />
            <div className="absolute w-32 h-32 border-2 border-gold-500/30" />
            <div className="absolute w-20 h-20 border-2 border-gold-500/20 rotate-45" />
            <div className="absolute w-8 h-8 border-2 border-gold-500/20" />
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
// 🎯 የማይክሮ-ኢንተራክሽን ኮምፖኔንት (Micro-interaction)
// ============================================================
function CursorGlow() {
  if (typeof window === 'undefined') return null;
  
  return (
    <div 
      className="fixed pointer-events-none z-50 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl transition-all duration-500"
      style={{
        left: 'var(--cursor-x, 50%)',
        top: 'var(--cursor-y, 50%)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

// ============================================================
// 🏗️ ዋናው ሌያውት (Root Layout)
// ============================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* የኢትዮጵያ ባህላዊ ፎንቶች - መያዣ (Preconnect for fonts) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* የኢትዮጵያ ወርቅ ቀለም ለስክሮል ባር */}
        <style>{`
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: hsl(var(--background));
          }
          ::-webkit-scrollbar-thumb {
            background: hsl(var(--gold-500) / 0.3);
            border-radius: 9999px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--gold-500) / 0.5);
          }
          * {
            scrollbar-color: hsl(var(--gold-500) / 0.3) transparent;
            scrollbar-width: thin;
          }
        `}</style>
      </head>
      
      <body 
        className={`
          ${inter.className}
          antialiased
          bg-background
          text-foreground
          min-h-screen
          selection:bg-gold-500/20 selection:text-gold-500
          dark:selection:bg-gold-500/30 dark:selection:text-gold-400
        `}
      >
        {/* የኢትዮጵያ ዳራ ፓተርን */}
        <EthiopianBackground />
        
        {/* የመጫኛ ሁኔታ አኒሜሽን (Loading State Animation) */}
        <div id="loading-screen" className="fixed inset-0 z-[9999] pointer-events-none">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl flex items-center justify-center opacity-0 transition-opacity duration-700">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gold-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-gold-500 border-t-transparent animate-ethiopian-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-forest-500/20" />
                <div className="absolute inset-2 rounded-full border-4 border-forest-500 border-t-transparent animate-ethiopian-spin" style={{ animationDelay: '-0.5s' }} />
              </div>
              <p className="text-gold-500 font-medium text-sm animate-pulse">Loading...</p>
            </div>
          </div>
        </div>

        {/* ዋና ይዘት */}
        <Providers>
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          
          {/* ማሳወቂያዎች */}
          <Toaster />
          
          {/* የመንገድ ወጪ አናሊቲክስ (Analytics) */}
          <Analytics />
          <SpeedInsights />
        </Providers>

        {/* የኢትዮጵያ ፉተር ባር (Footer Bar with Ethiopian Pattern) */}
        <div className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none">
          <div className="h-2 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
          <div className="h-1 bg-gradient-to-r from-forest-500/20 via-gold-500/30 to-earth-500/20" />
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
        </div>

        {/* የመጫኛ ሁኔታ ማስተዳደር (Loading State Management) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', () => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                  const overlay = loadingScreen.querySelector('.opacity-0');
                  if (overlay) {
                    // አኒሜሽን ካጠናቀቀ በኋላ ያሳይ
                    setTimeout(() => {
                      overlay.classList.remove('opacity-0');
                      overlay.classList.add('opacity-100');
                      setTimeout(() => {
                        overlay.classList.remove('opacity-100');
                        overlay.classList.add('opacity-0');
                        setTimeout(() => {
                          loadingScreen.style.display = 'none';
                        }, 700);
                      }, 800);
                    }, 300);
                  }
                }
              });
            `,
          }}
        />

        {/* የመንገድ ወጪ ግሎው (Cursor Glow) */}
        <CursorGlow />
      </body>
    </html>
  );
}

// ============================================================
// 🎨 የተጨማሪ አማራጭ - ለNext.js 15 ልዩ የተሻሻለ እትም
// ============================================================
// ለApp Router መረጃ - ለዳይናሚክ ሜታዳታ
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour