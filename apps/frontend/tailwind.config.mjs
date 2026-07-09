/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ============================================================
      // 🎨 የኢትዮጵያ ቀለማት (Ethiopian Color Palette)
      // ============================================================
      colors: {
        // -------- መሰረታዊ ቀለማት (Base Colors) --------
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // -------- ተጨማሪ ገጽታ ቀለማት (Surface Colors) --------
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
          hover: "hsl(var(--surface-hover))",
          secondary: "hsl(var(--surface-secondary))",
        },
        
        // -------- ዋና ቀለማት (Primary Colors) --------
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // -------- 🟢 የኢትዮጵያ ቀለማት (Ethiopian Colors) --------
        // ወርቅ (Gold) - ከላሊበላ ቤተክርስቲያን ተመስጦ
        gold: {
          50: "#FFFDF7",
          100: "#FFF8E1",
          200: "#FDEB9E",
          300: "#FCDE5B",
          400: "#FBD118",
          500: "#D4A843",
          600: "#B88E38",
          700: "#9C742E",
          800: "#805A23",
          900: "#5C3D00",
          950: "#3A2600",
        },
        
        // 🌳 ደን (Forest) - ከኢትዮጵያ ደኖች ተመስጦ
        forest: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#1B8A4A",
          600: "#16753E",
          700: "#116032",
          800: "#0C4A26",
          900: "#052E16",
          950: "#031F0E",
        },
        
        // 🔴 ምድር (Earth) - ከኢትዮጵያ ደጋማ አካባቢዎች ተመስጦ
        earth: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#C53030",
          600: "#A82828",
          700: "#8B2020",
          800: "#6E1818",
          900: "#4A0D0D",
          950: "#2F0808",
        },

        // 🏔️ ተራራ (Mountain) - ከስመን ተራሮች ተመስጦ
        mountain: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },

        // ============================================================
        // 🎨 ልዩ የቀለም ስሞች (Color Aliases for Easy Use)
        // ============================================================
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        "border-default": "hsl(var(--border-default))",
        "border-hover": "hsl(var(--border-hover))",
        "border-subtle": "hsl(var(--border-subtle))",
      },

      // ============================================================
      // 🔤 ፎንቶች (Fonts)
      // ============================================================
      fontFamily: {
        // ለርዕሶች
        cabinet: ["Cabinet Grotesk", "sans-serif"],
        clash: ["Clash Display", "sans-serif"],
        // ለጽሁፍ
        inter: ["Inter", "sans-serif"],
        satoshi: ["Satoshi", "sans-serif"],
        // ለኮድ
        mono: ["JetBrains Mono", "monospace"],
      },

      // ============================================================
      // 📐 ራዲየስ (Border Radius)
      // ============================================================
      borderRadius: {
        "sm": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
        "4xl": "3rem",
        "full": "9999px",
      },

      // ============================================================
      // 🎨 ሼዶውስ (Shadows)
      // ============================================================
      boxShadow: {
        // መሰረታዊ ሼዶውስ
        "premium-sm": "0 2px 8px hsl(var(--shadow-color) / 0.06)",
        "premium-md": "0 8px 32px hsl(var(--shadow-color) / 0.08)",
        "premium-lg": "0 20px 60px hsl(var(--shadow-color) / 0.12)",
        "premium-xl": "0 40px 80px hsl(var(--shadow-color) / 0.16)",
        
        // የኢትዮጵያ ልዩ ሼዶውስ
        "gold-glow": "0 0 40px hsl(var(--gold-500) / 0.2), 0 0 80px hsl(var(--gold-500) / 0.1)",
        "gold-glow-sm": "0 0 20px hsl(var(--gold-500) / 0.15)",
        "gold-glow-lg": "0 0 60px hsl(var(--gold-500) / 0.25), 0 0 120px hsl(var(--gold-500) / 0.1)",
        
        "ethiopian-glow": "0 0 40px hsl(var(--forest-500) / 0.15), 0 0 80px hsl(var(--gold-500) / 0.1), 0 0 120px hsl(var(--earth-500) / 0.05)",
        
        // ኒውሞርፊክ
        "neumorphic": "12px 12px 24px hsl(var(--shadow-color) / 0.1), -12px -12px 24px hsl(var(--highlight-color) / 0.5)",
        "neumorphic-dark": "12px 12px 24px hsl(var(--shadow-color) / 0.2), -12px -12px 24px hsl(var(--highlight-color) / 0.1)",
        
        // ግላስ
        "glass": "0 8px 32px hsl(var(--shadow-color) / 0.08)",
        "glass-lg": "0 20px 60px hsl(var(--shadow-color) / 0.12)",
        
        // ተጨማሪ
        "inner-glow": "inset 0 1px 0 hsl(var(--gold-500) / 0.05)",
        "card-hover": "0 20px 60px hsl(var(--shadow-color) / 0.12), 0 0 40px hsl(var(--gold-500) / 0.05)",
      },

      // ============================================================
      // 🎨 የዳራ ፓተርኖች (Background Patterns)
      // ============================================================
      backgroundImage: {
        // የኢትዮጵያ ጥልምም ፓተርኖች
        "ethiopian-diamonds": `
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            hsl(var(--gold-500) / 0.03) 20px,
            hsl(var(--gold-500) / 0.03) 21px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 20px,
            hsl(var(--gold-500) / 0.03) 20px,
            hsl(var(--gold-500) / 0.03) 21px
          )
        `,
        
        "ethiopian-cross": `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 30px,
            hsl(var(--earth-500) / 0.02) 30px,
            hsl(var(--earth-500) / 0.02) 31px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 30px,
            hsl(var(--earth-500) / 0.02) 30px,
            hsl(var(--earth-500) / 0.02) 31px
          )
        `,
        
        "ethiopian-tessellation": `
          repeating-linear-gradient(
            60deg,
            transparent,
            transparent 15px,
            hsl(var(--forest-500) / 0.02) 15px,
            hsl(var(--forest-500) / 0.02) 16px
          ),
          repeating-linear-gradient(
            120deg,
            transparent,
            transparent 15px,
            hsl(var(--forest-500) / 0.02) 15px,
            hsl(var(--forest-500) / 0.02) 16px
          )
        `,
        
        "ethiopian-dots": `
          radial-gradient(
            circle at 20px 20px,
            hsl(var(--gold-500) / 0.03) 2px,
            transparent 2px
          ),
          radial-gradient(
            circle at 20px 0px,
            hsl(var(--gold-500) / 0.03) 2px,
            transparent 2px
          ),
          radial-gradient(
            circle at 0px 20px,
            hsl(var(--gold-500) / 0.03) 2px,
            transparent 2px
          ),
          radial-gradient(
            circle at 0px 0px,
            hsl(var(--gold-500) / 0.03) 2px,
            transparent 2px
          )
        `,

        // ግራዲየንቶች
        "gradient-ethiopian": "linear-gradient(135deg, hsl(var(--forest-500)), hsl(var(--gold-500)), hsl(var(--earth-500)))",
        "gradient-ethiopian-soft": "linear-gradient(135deg, hsl(var(--forest-500) / 0.2), hsl(var(--gold-500) / 0.2), hsl(var(--earth-500) / 0.2))",
        "gradient-gold": "linear-gradient(135deg, hsl(var(--gold-400)), hsl(var(--gold-600)))",
        "gradient-gold-soft": "linear-gradient(135deg, hsl(var(--gold-400) / 0.2), hsl(var(--gold-600) / 0.2))",
        "gradient-forest": "linear-gradient(135deg, hsl(var(--forest-500)), hsl(var(--forest-700)))",
        "gradient-earth": "linear-gradient(135deg, hsl(var(--earth-500)), hsl(var(--earth-700)))",
      },

      // ============================================================
      // 🎬 አኒሜሽኖች (Animations)
      // ============================================================
      animation: {
        // መሰረታዊ
        "fade-in": "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-down": "fadeDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in": "slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-out": "slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        
        // የኢትዮጵያ ልዩ
        "ethiopian-spin": "ethiopianSpin 1s linear infinite",
        "ethiopian-bounce": "ethiopianBounce 0.6s ease-in-out infinite",
        "ethiopian-wave": "waveEthiopian 4s ease-in-out infinite",
        "ethiopian-float": "floatEthiopian 6s ease-in-out infinite",
        
        // ሼይመር
        "shimmer": "shimmer 2s ease-in-out infinite",
        "shimmer-gold": "shimmerGold 2s ease-in-out infinite",
        "shimmer-ethiopian": "shimmerEthiopian 3s ease-in-out infinite",
        
        // ግሎው
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        
        // ሌሎች
        "breathe": "breathe 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "ripple": "ripple 0.6s linear",
        "spin-slow": "spin 3s linear infinite",
        "spin-slower": "spin 6s linear infinite",
      },

      // ============================================================
      // 🎬 ኪፍሬም አኒሜሽኖች (Keyframes)
      // ============================================================
      keyframes: {
        // -------- የኢትዮጵያ ስፒነር --------
        ethiopianSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        
        // -------- የኢትዮጵያ ቦውንስ --------
        ethiopianBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        
        // -------- የኢትዮጵያ ሞገድ --------
        waveEthiopian: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        
        // -------- የኢትዮጵያ ተንሳፋፊ --------
        floatEthiopian: {
          "0%, 100%": { transform: "translateY(0) scale(1)" },
          "33%": { transform: "translateY(-10px) scale(1.02)" },
          "66%": { transform: "translateY(5px) scale(0.98)" },
        },
        
        // -------- ፌድ ኢን --------
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        
        // -------- ፌድ አፕ --------
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        
        // -------- ፌድ ዳውን --------
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        
        // -------- ስኬል ኢን --------
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        
        // -------- ስላይድ ኢን --------
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        
        // -------- ስላይድ አውት --------
        slideOut: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-30px)" },
        },
        
        // -------- ሼይመር --------
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shimmerGold: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        shimmerEthiopian: {
          "0%": { backgroundPosition: "-300% 0" },
          "100%": { backgroundPosition: "300% 0" },
        },
        
        // -------- ግሎው ፑልስ --------
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--gold-500) / 0.1)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--gold-500) / 0.3), 0 0 80px hsl(var(--gold-500) / 0.1)" },
        },
        
        // -------- ሪፕል --------
        ripple: {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        
        // -------- ብሪዝ --------
        breathe: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        
        // -------- ፍሎት --------
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },

      // ============================================================
      // 🎨 የግልጽነት (Opacity)
      // ============================================================
      opacity: {
        "1": "0.01",
        "2": "0.02",
        "3": "0.03",
        "4": "0.04",
        "5": "0.05",
        "6": "0.06",
        "7": "0.07",
        "8": "0.08",
        "9": "0.09",
      },

      // ============================================================
      // 📦 የስፔሲንግ (Spacing)
      // ============================================================
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "100": "25rem",
        "120": "30rem",
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
        "192": "48rem",
      },

      // ============================================================
      // 📐 የትራንዚሽን (Transitions)
      // ============================================================
      transitionDuration: {
        "2000": "2000ms",
        "3000": "3000ms",
        "4000": "4000ms",
        "5000": "5000ms",
      },
      
      transitionDelay: {
        "100": "100ms",
        "200": "200ms",
        "300": "300ms",
        "400": "400ms",
        "500": "500ms",
        "600": "600ms",
        "700": "700ms",
        "800": "800ms",
        "900": "900ms",
        "1000": "1000ms",
      },

      // ============================================================
      // 🎯 የትራንስፎርም (Transform)
      // ============================================================
      scale: {
        "98": "0.98",
        "102": "1.02",
        "105": "1.05",
      },

      // ============================================================
      // 📱 የስክሪን መጠኖች (Screens)
      // ============================================================
      screens: {
        "xs": "475px",
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
        "3xl": "1920px",
        "4xl": "2560px",
      },

      // ============================================================
      // 🔤 የፊደል ክብደት (Font Weight)
      // ============================================================
      fontWeight: {
        "thin": "100",
        "extralight": "200",
        "light": "300",
        "normal": "400",
        "medium": "500",
        "semibold": "600",
        "bold": "700",
        "extrabold": "800",
        "black": "900",
      },

      // ============================================================
      // 📏 የፊደል መጠን (Font Size)
      // ============================================================
      fontSize: {
        "xxs": ["0.625rem", { lineHeight: "0.875rem" }],
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },

      // ============================================================
      // 📦 የዝርዝር ዓይነቶች (List Style Type)
      // ============================================================
      listStyleType: {
        "ethiopian": "ethiopian",
        "geometric": "geometric",
        "cross": "cross",
      },
    },
  },

  // ============================================================
  // 🔌 ፕላጊኖች (Plugins)
  // ============================================================
  plugins: [
    // ተጨማሪ የዝርዝር አይነቶች
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.list-ethiopian': {
          listStyleType: 'ethiopian',
        },
        '.list-geometric': {
          listStyleType: 'geometric',
        },
        '.list-cross': {
          listStyleType: 'cross',
        },
        // የተንሳፋፊ አኒሜሽን
        '.animate-delay-100': {
          animationDelay: '100ms',
        },
        '.animate-delay-200': {
          animationDelay: '200ms',
        },
        '.animate-delay-300': {
          animationDelay: '300ms',
        },
        '.animate-delay-400': {
          animationDelay: '400ms',
        },
        '.animate-delay-500': {
          animationDelay: '500ms',
        },
        '.animate-delay-600': {
          animationDelay: '600ms',
        },
        '.animate-delay-700': {
          animationDelay: '700ms',
        },
        '.animate-delay-800': {
          animationDelay: '800ms',
        },
        '.animate-delay-900': {
          animationDelay: '900ms',
        },
        '.animate-delay-1000': {
          animationDelay: '1000ms',
        },
        // የኢትዮጵያ ፓተርን ክፍሎች
        '.bg-ethiopian-diamonds': {
          backgroundImage: theme('backgroundImage.ethiopian-diamonds'),
        },
        '.bg-ethiopian-cross': {
          backgroundImage: theme('backgroundImage.ethiopian-cross'),
        },
        '.bg-ethiopian-tessellation': {
          backgroundImage: theme('backgroundImage.ethiopian-tessellation'),
        },
        '.bg-ethiopian-dots': {
          backgroundImage: theme('backgroundImage.ethiopian-dots'),
        },
        // ግላስ ኤፌክቶች
        '.glass': {
          background: 'hsl(var(--background) / 0.3)',
          backdropFilter: 'blur(20px) saturate(1.5)',
          border: '1px solid hsl(var(--border-subtle) / 0.5)',
          boxShadow: '0 8px 32px hsl(var(--shadow-color) / 0.08)',
        },
        '.glass-heavy': {
          background: 'hsl(var(--background) / 0.6)',
          backdropFilter: 'blur(30px) saturate(1.8)',
          border: '1px solid hsl(var(--border-subtle) / 0.6)',
          boxShadow: '0 8px 32px hsl(var(--shadow-color) / 0.12)',
        },
        '.glass-light': {
          background: 'hsl(var(--background) / 0.1)',
          backdropFilter: 'blur(10px) saturate(1.2)',
          border: '1px solid hsl(var(--border-subtle) / 0.3)',
          boxShadow: '0 4px 16px hsl(var(--shadow-color) / 0.04)',
        },
        // የኢትዮጵያ ግላስ
        '.glass-ethiopian': {
          background: 'linear-gradient(135deg, hsl(var(--gold-500) / 0.05), hsl(var(--gold-500) / 0.02))',
          backdropFilter: 'blur(20px) saturate(1.5)',
          border: '1px solid hsl(var(--gold-500) / 0.1)',
          boxShadow: '0 8px 32px hsl(var(--shadow-color) / 0.08), 0 0 40px hsl(var(--gold-500) / 0.05)',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

export default config;