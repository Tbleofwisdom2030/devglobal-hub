'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { loginSchema, type LoginFormData } from '@devglobal/shared';
import { Button } from '@devglobal/ui';
import { useAuth } from '@/hooks/use-auth';
import { 
  Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, 
  Github, Chrome, Sparkles, Shield, Fingerprint,
  ChevronRight, AlertCircle, CheckCircle2,
  Crown, Star, Code2, Users, Globe2, Zap,
  EthiopianBirr, Gift
} from 'lucide-react';

// ===== የኢትዮጵያ ጥልምም ፓተርን ኮምፖኔንት =====
function EthiopianPattern({
  variant = 'diamonds',
  opacity = 0.05,
  className = '',
}: {
  variant?: 'diamonds' | 'cross' | 'tessellation' | 'dots';
  opacity?: number;
  className?: string;
}) {
  const patterns = {
    diamonds: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 20px,
        rgba(212, 168, 67, ${opacity}) 20px,
        rgba(212, 168, 67, ${opacity}) 21px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 20px,
        rgba(212, 168, 67, ${opacity}) 20px,
        rgba(212, 168, 67, ${opacity}) 21px
      )
    `,
    cross: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 30px,
        rgba(199, 48, 48, ${opacity * 0.7}) 30px,
        rgba(199, 48, 48, ${opacity * 0.7}) 31px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 30px,
        rgba(199, 48, 48, ${opacity * 0.7}) 30px,
        rgba(199, 48, 48, ${opacity * 0.7}) 31px
      )
    `,
    tessellation: `
      repeating-linear-gradient(
        60deg,
        transparent,
        transparent 15px,
        rgba(27, 138, 74, ${opacity}) 15px,
        rgba(27, 138, 74, ${opacity}) 16px
      ),
      repeating-linear-gradient(
        120deg,
        transparent,
        transparent 15px,
        rgba(27, 138, 74, ${opacity}) 15px,
        rgba(27, 138, 74, ${opacity}) 16px
      )
    `,
    dots: `
      radial-gradient(
        circle at 20px 20px,
        rgba(212, 168, 67, ${opacity}) 2px,
        transparent 2px
      ),
      radial-gradient(
        circle at 20px 0px,
        rgba(212, 168, 67, ${opacity}) 2px,
        transparent 2px
      ),
      radial-gradient(
        circle at 0px 20px,
        rgba(212, 168, 67, ${opacity}) 2px,
        transparent 2px
      ),
      radial-gradient(
        circle at 0px 0px,
        rgba(212, 168, 67, ${opacity}) 2px,
        transparent 2px
      )
    `
  };

  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        backgroundImage: patterns[variant],
        backgroundSize: variant === 'dots' ? '40px 40px' : '40px 40px',
        opacity: 1
      }}
    />
  );
}

// ===== ኢትዮጵያዊ ግላስ ኢፌክት =====
function EthiopianGlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`
      relative overflow-hidden
      bg-gradient-to-br from-surface-secondary/80 to-surface-primary/60
      backdrop-blur-2xl backdrop-saturate-150
      border border-white/5
      shadow-2xl shadow-black/20
      ${className}
    `}>
      {/* የኢትዮጵያ ባንድ በላይ */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-500 via-gold-500 to-earth-500" />
      
      {/* ጥልምም ፓተርን በዳራ */}
      <EthiopianPattern variant="diamonds" opacity={0.03} />
      <EthiopianPattern variant="dots" opacity={0.02} className="opacity-50" />
      
      {children}
    </div>
  );
}

// ===== ፕሪሚየም ኢንፑት ክፍል =====
function PremiumInput({
  label,
  type = 'text',
  icon: Icon,
  error,
  showPasswordToggle,
  value,
  ...props
}: {
  label: string;
  type?: string;
  icon: React.ElementType;
  error?: string;
  showPasswordToggle?: boolean;
  value?: string;
  [key: string]: any;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputId = label.toLowerCase().replace(/\s+/g, '-');
  
  const isValid = value && value.length > 0 && !error;
  const isTouched = value && value.length > 0;

  return (
    <div className="space-y-1.5">
      <label 
        htmlFor={inputId}
        className={`
          block text-sm font-medium ml-1 transition-all duration-300
          ${isFocused ? 'text-gold-500' : 'text-text-secondary'}
        `}
      >
        {label}
      </label>
      
      <motion.div 
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileTap={{ scale: 0.995 }}
      >
        {/* የጥልምም ቦርደር ግሎው */}
        <motion.div 
          className={`
            absolute inset-0 rounded-xl transition-all duration-500
            ${isFocused 
              ? 'ring-2 ring-gold-500/50 shadow-glow-gold' 
              : isHovered
                ? 'ring-1 ring-border-hover'
                : 'ring-1 ring-border-default'
            }
          `}
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* የኢትዮጵያ ፓተርን በቦርደር ላይ (ዶቶች) */}
        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-12 h-12 opacity-5">
            <EthiopianPattern variant="dots" opacity={0.5} />
          </div>
        </div>

        {/* አይከን */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Icon className={`
            w-5 h-5 transition-all duration-300
            ${isFocused ? 'text-gold-500 scale-110' : isHovered ? 'text-text-secondary' : 'text-text-tertiary'}
          `} />
        </div>

        {/* ኢንፑት ፊልድ */}
        <input
          id={inputId}
          type={showPassword ? 'text' : type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full h-12 pl-12 pr-12 rounded-xl 
            bg-surface-secondary/80 backdrop-blur-sm
            text-text-primary placeholder:text-text-tertiary/60
            transition-all duration-300 relative z-10
            focus:outline-none focus:bg-surface-hover/80
            text-sm font-medium
            ${error ? 'ring-2 ring-earth-500/50' : ''}
            ${isValid ? 'ring-2 ring-forest-500/30' : ''}
          `}
          {...props}
        />

        {/* ፓስዎርድ ቶግል */}
        {showPasswordToggle && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 
                       text-text-tertiary hover:text-text-primary transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </motion.button>
        )}

        {/* ስኬስ ምልክት - አኒሜሽን ያለው */}
        <AnimatePresence>
          {isValid && (
            <motion.div 
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 400 } }
              }}
              className="absolute right-12 top-1/2 -translate-y-1/2 z-10"
            >
              <div className="p-0.5 rounded-full bg-forest-500/20">
                <CheckCircle2 className="w-4 h-4 text-forest-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ግሎው ኤፌክት (አኒሜሽን) */}
        {isFocused && (
          <motion.div 
            className="absolute inset-0 rounded-xl pointer-events-none"
            animate={{
              boxShadow: [
                'inset 0 0 20px rgba(212,168,67,0.05)',
                'inset 0 0 40px rgba(212,168,67,0.1)',
                'inset 0 0 20px rgba(212,168,67,0.05)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* የስህተት መልእክት - አኒሜሽን ያለው */}
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -5, x: 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1.5 text-xs text-earth-500 ml-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== የፓስዎርድ ጥንካሬ አመልካች =====
function PasswordStrength({ password }: { password: string }) {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    let score = 0;
    if (password.length === 0) {
      setStrength(0);
      setLabel('');
      return;
    }
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    setStrength(score);
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    setLabel(labels[Math.min(score - 1, 4)] || '');
  }, [password]);

  if (!password) return null;

  const colors = ['#C53030', '#E67E22', '#D4A843', '#1B8A4A', '#0EA5E9'];
  const bgColors = ['bg-earth-500', 'bg-orange-500', 'bg-gold-500', 'bg-forest-500', 'bg-sky-500'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-1 space-y-1"
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= strength ? bgColors[strength - 1] || 'bg-border-default' : 'bg-border-default/30'
            }`}
            animate={{
              scale: i <= strength ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      {label && (
        <p className="text-xs text-text-tertiary">
          Password strength: <span className="font-medium" style={{ color: colors[strength - 1] || '#666' }}>
            {label}
          </span>
        </p>
      )}
    </motion.div>
  );
}

// ===== ዋናው የሎጊን ፎርም =====
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  
  const verifiedEmail = searchParams.get('verified');
  const resetSuccess = searchParams.get('reset');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(
        error.response?.data?.error || 'Invalid email or password'
      );
    }
  };

  return (
    <div className="w-full max-w-md relative">
      {/* ===== ፍሎቲንግ ኢሜጆች ===== */}
      <motion.div 
        className="absolute -top-12 -right-12 w-24 h-24 text-gold-500/10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Crown className="w-full h-full" />
      </motion.div>
      <motion.div 
        className="absolute -bottom-12 -left-12 w-20 h-20 text-forest-500/10"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
      >
        <Star className="w-full h-full" />
      </motion.div>

      {/* ===== ሄደር ===== */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
      >
        <Link href="/" className="inline-block mb-6 group">
          <motion.div 
            className="flex items-center gap-2 justify-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 
                          flex items-center justify-center shadow-glow-gold">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-cabinet bg-gradient-to-r from-forest-500 via-gold-500 to-earth-500 bg-clip-text text-transparent">
              DevGlobal Hub
            </h1>
          </motion.div>
        </Link>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-3 font-cabinet"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Welcome back
        </motion.h2>
        <motion.p 
          className="text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Sign in to continue your journey
        </motion.p>
      </motion.div>

      {/* ===== ስኬስ ማሳወቂያ ===== */}
      <AnimatePresence>
        {(verifiedEmail || resetSuccess) && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="mb-6 p-4 rounded-xl bg-forest-500/10 border border-forest-500/30 flex items-center gap-3"
          >
            <motion.div 
              className="p-1.5 rounded-full bg-forest-500/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
            </motion.div>
            <p className="text-sm text-forest-600 dark:text-forest-400">
              {verifiedEmail ? 'Email verified successfully! Please sign in.' : 'Password reset successfully! Please sign in.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ዋና ካርድ ===== */}
      <EthiopianGlassCard className="rounded-2xl p-8">
        {/* ===== የስህተት ማሳወቂያ ===== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 rounded-xl bg-earth-500/10 border border-earth-500/30 flex items-center gap-3"
            >
              <div className="p-1.5 rounded-full bg-earth-500/20">
                <AlertCircle className="w-4 h-4 text-earth-500" />
              </div>
              <p className="text-sm text-earth-600 dark:text-earth-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== ፎርም ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <PremiumInput
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email?.message}
            value={emailValue || ''}
            {...register('email')}
          />

          <div>
            <PremiumInput
              label="Password"
              type="password"
              icon={Lock}
              placeholder="Enter your password"
              error={errors.password?.message}
              showPasswordToggle
              value={passwordValue || ''}
              onFocus={() => setShowPasswordStrength(true)}
              {...register('password')}
            />
            {showPasswordStrength && (
              <PasswordStrength password={passwordValue || ''} />
            )}
          </div>

          {/* ===== ተጨማሪ አማራጮች ===== */}
          <div className="flex items-center justify-between pt-2">
            <motion.label 
              className="flex items-center gap-2 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <motion.div 
                  className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center
                    transition-all duration-300
                    ${rememberMe 
                      ? 'bg-gold-500 border-gold-500' 
                      : 'border-border-default group-hover:border-gold-500/50'
                    }
                  `}
                  animate={{
                    scale: rememberMe ? 1 : 0.95,
                  }}
                >
                  {rememberMe && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Remember me
              </span>
            </motion.label>

            <Link
              href="/forgot-password"
              className="text-sm text-gold-500 hover:text-gold-400 transition-colors font-medium flex items-center gap-1"
            >
              Forgot password?
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* ===== ሰብሚት ቡቶን ===== */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              variant="gradient"
              className="w-full h-12 rounded-xl font-semibold text-base relative overflow-hidden group"
              disabled={isSubmitting}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </>
                )}
              </span>
              {/* ሻይመር ውጤት */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {/* የኢትዮጵያ ፓተርን በቡቶን ላይ (እጅግ ደብዛዛ) */}
              <EthiopianPattern variant="dots" opacity={0.02} />
            </Button>
          </motion.div>

          {/* ===== ባዮሜትሪክ አማራጭ ===== */}
          <AnimatePresence>
            {useBiometric && (
              <motion.button
                type="button"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full h-12 rounded-xl border-2 border-dashed border-gold-500/30 
                           flex items-center justify-center gap-3 text-gold-500 
                           hover:bg-gold-500/5 transition-all duration-300
                           font-medium text-sm overflow-hidden"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <Fingerprint className="w-5 h-5" />
                Authenticate with Biometrics
              </motion.button>
            )}
          </AnimatePresence>

          {/* ===== ባዮሜትሪክ ቶግል ===== */}
          {!useBiometric && (
            <motion.button
              type="button"
              onClick={() => setUseBiometric(true)}
              className="w-full text-xs text-text-tertiary hover:text-gold-500 transition-colors flex items-center justify-center gap-1"
              whileHover={{ scale: 1.02 }}
            >
              <Fingerprint className="w-3 h-3" />
              Use biometric authentication
            </motion.button>
          )}
        </form>

        {/* ===== ሶሻል ሎጊን ===== */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-raised px-4 text-text-tertiary flex items-center gap-2">
                <span>or continue with</span>
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-11 rounded-xl 
                         border border-border-default hover:border-border-hover
                         bg-surface-secondary hover:bg-surface-hover
                         transition-all duration-300 text-sm font-medium group
                         relative overflow-hidden"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
              GitHub
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-11 rounded-xl 
                         border border-border-default hover:border-border-hover
                         bg-surface-secondary hover:bg-surface-hover
                         transition-all duration-300 text-sm font-medium group
                         relative overflow-hidden"
            >
              <Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Google
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </motion.button>
          </div>
        </div>
      </EthiopianGlassCard>

      {/* ===== ምዝገባ ሊንክ ===== */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link 
            href="/register" 
            className="text-gold-500 hover:text-gold-400 font-medium 
                       transition-colors inline-flex items-center gap-1 group"
          >
            Create one
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </p>
      </motion.div>

      {/* ===== ፉተር ===== */}
      <motion.div 
        className="mt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-center gap-1 mb-3">
          <Shield className="w-3.5 h-3.5 text-text-tertiary" />
          <p className="text-xs text-text-tertiary">
            Protected by enterprise-grade encryption
          </p>
        </div>
        <p className="text-xs text-text-tertiary flex items-center justify-center gap-4">
          <Link href="/terms" className="hover:text-text-secondary transition-colors">
            Terms
          </Link>
          <span className="text-border-default">•</span>
          <Link href="/privacy" className="hover:text-text-secondary transition-colors">
            Privacy
          </Link>
          <span className="text-border-default">•</span>
          <Link href="/support" className="hover:text-text-secondary transition-colors">
            Support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ===== የገጹ ዋና አቀማመጥ =====
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* የኢትዮጵያ ስፒነር */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gold-500/20" />
            <div className="absolute inset-0 rounded-full border-4 border-gold-500 border-t-transparent animate-ethiopian-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-forest-500/20" />
            <div className="absolute inset-2 rounded-full border-4 border-forest-500 border-t-transparent animate-ethiopian-spin" style={{ animationDelay: '-0.5s' }} />
          </div>
          <p className="text-text-secondary text-sm">Loading your experience...</p>
        </motion.div>
      </div>
    }>
      <div className="min-h-screen flex bg-surface-primary relative overflow-hidden">
        {/* ===== ዳራ ግራዲየንቶች ===== */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-forest-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-earth-500/3 rounded-full blur-3xl" />
          
          {/* የኢትዮጵያ ፓተርን በዳራ */}
          <EthiopianPattern variant="tessellation" opacity={0.01} />
          <EthiopianPattern variant="diamonds" opacity={0.005} />
        </div>

        {/* ===== ግራ በኩል - ፎርም ===== */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 lg:px-8 relative z-10">
          <LoginForm />
        </div>

        {/* ===== ቀኝ በኩል - የጥልምም ፓተርን ዲስፕሌይ ===== */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-surface-secondary/30 backdrop-blur-sm">
          {/* የኢትዮጵያ ጥልምም ፓተርን */}
          <EthiopianPattern variant="cross" opacity={0.04} />
          <EthiopianPattern variant="diamonds" opacity={0.03} />
          <EthiopianPattern variant="tessellation" opacity={0.02} />
          
          {/* የቀለም ንጣፎች */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-forest-500/5 blur-3xl" 
               style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '-4s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-earth-500/5 blur-3xl"
               style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '-2s' }} />

          {/* ማዕከላዊ ይዘት */}
          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center w-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="max-w-lg"
            >
              {/* የኢትዮጵያ ባንዲራ ግራዲየንት ሎጎ */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.22, 0.61, 0.36, 1],
                  type: "spring",
                  stiffness: 200
                }}
                className="w-28 h-28 rounded-3xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 
                           flex items-center justify-center mb-8 shadow-2xl shadow-gold-500/30 mx-auto
                           relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-500/20 via-transparent to-earth-500/20" />
                <EthiopianPattern variant="cross" opacity={0.05} />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative"
                >
                  <Code2 className="w-14 h-14 text-white" />
                </motion.div>
              </motion.div>

              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl font-bold mb-4 font-cabinet"
              >
                Built for <span className="gradient-text-ethiopian">Creators</span>
              </motion.h2>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-text-secondary leading-relaxed"
              >
                Experience a platform where every pixel is crafted with purpose, 
                and every interaction tells a story of innovation.
              </motion.p>

              {/* ===== የስታቲስቲክስ ካርዶች ===== */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-12 grid grid-cols-3 gap-4"
              >
                {[
                  { value: '99.9%', label: 'Uptime', icon: Zap },
                  { value: '50K+', label: 'Developers', icon: Users },
                  { value: '150+', label: 'Countries', icon: Globe2 },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-xl bg-surface-raised/50 backdrop-blur-sm border border-white/5
                               hover:border-gold-500/20 transition-all duration-300 group cursor-default"
                    whileHover={{ 
                      y: -4,
                      scale: 1.02,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <stat.icon className="w-4 h-4 text-gold-500/60 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xl font-bold gradient-text-gold">{stat.value}</div>
                    <div className="text-xs text-text-tertiary">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ===== ሽልማት ባጅ ===== */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 flex items-center justify-center gap-4"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
                  <Gift className="w-3.5 h-3.5 text-gold-500" />
                  <span className="text-xs text-gold-500">Premium</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-500/10 border border-forest-500/20">
                  <Star className="w-3.5 h-3.5 text-forest-500" />
                  <span className="text-xs text-forest-500">Secure</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-earth-500/10 border border-earth-500/20">
                  <Shield className="w-3.5 h-3.5 text-earth-500" />
                  <span className="text-xs text-earth-500">Trusted</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}