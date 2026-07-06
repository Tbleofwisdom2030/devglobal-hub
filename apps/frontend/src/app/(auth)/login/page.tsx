'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { loginSchema, type LoginFormData } from '@devglobal/shared';
import { Button } from '@devglobal/ui';
import { useAuth } from '@/hooks/use-auth';
import { 
  Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, 
  Github, Chrome, Sparkles, Shield, Fingerprint,
  ChevronRight, AlertCircle, CheckCircle2
} from 'lucide-react';
import { EthiopianPattern } from '@/components/ui/ethiopian-pattern';

// ===== ፕሪሚየም አኒሜሽን ቫሪያንቶች =====
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }
  })
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } }
};

// ===== ፕሪሚየም ኢንፑት ክፍል =====
function PremiumInput({
  label,
  type = 'text',
  icon: Icon,
  error,
  showPasswordToggle,
  ...props
}: {
  label: string;
  type?: string;
  icon: React.ElementType;
  error?: string;
  showPasswordToggle?: boolean;
  [key: string]: any;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-text-secondary ml-1 transition-colors duration-300"
      >
        {label}
      </label>
      <div className="relative group">
        {/* የጥልምም ቦርደር ግሎው */}
        <div className={`
          absolute inset-0 rounded-xl transition-all duration-500
          ${isFocused 
            ? 'ring-2 ring-gold-500/50 shadow-glow-gold' 
            : 'ring-1 ring-border-default group-hover:ring-border-hover'
          }
        `} />
        
        {/* አይከን */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <Icon className={`w-5 h-5 transition-colors duration-300 ${
            isFocused ? 'text-gold-500' : 'text-text-tertiary'
          }`} />
        </div>

        {/* ኢንፑት ፊልድ */}
        <input
          id={inputId}
          type={showPassword ? 'text' : type}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full h-12 pl-12 pr-12 rounded-xl 
            bg-surface-secondary 
            text-text-primary placeholder:text-text-tertiary
            transition-all duration-300 relative z-10
            focus:outline-none focus:bg-surface-hover
            text-sm font-medium
            ${error ? 'ring-2 ring-earth-500/50' : ''}
          `}
          {...props}
        />

        {/* ፓስዎርድ ቶግል */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 
                       text-text-tertiary hover:text-text-primary transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}

        {/* ስኬስ ምልክት */}
        {!error && props.value && (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={scaleIn}
            className="absolute right-12 top-1/2 -translate-y-1/2 z-10"
          >
            <CheckCircle2 className="w-4 h-4 text-forest-500" />
          </motion.div>
        )}
      </div>

      {/* የስህተት መልእክት */}
      <AnimatePresence>
        {error && (
          <motion.p 
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideInRight}
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

// ===== ዋናው የሎጊን ፎርም =====
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);
  
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
    <div className="w-full max-w-md">
      {/* ===== ሄደር ===== */}
      <motion.div 
        className="text-center mb-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <Link href="/" className="inline-block mb-8">
          <h1 className="text-3xl font-bold gradient-text-ethiopian font-cabinet">
            DevGlobal Hub
          </h1>
        </Link>
        
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-3 font-cabinet"
          variants={fadeInUp}
          custom={1}
        >
          Welcome back
        </motion.h2>
        <motion.p 
          className="text-text-secondary"
          variants={fadeInUp}
          custom={2}
        >
          Sign in to continue your journey
        </motion.p>
      </motion.div>

      {/* ===== ስኬስ ማሳወቂያ ===== */}
      <AnimatePresence>
        {(verifiedEmail || resetSuccess) && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideInRight}
            className="mb-6 p-4 rounded-xl bg-forest-500/10 border border-forest-500/30 flex items-center gap-3"
          >
            <div className="p-1.5 rounded-full bg-forest-500/20">
              <CheckCircle2 className="w-4 h-4 text-forest-500" />
            </div>
            <p className="text-sm text-forest-600 dark:text-forest-400">
              {verifiedEmail ? 'Email verified successfully! Please sign in.' : 'Password reset successfully! Please sign in.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ዋና ካርድ ===== */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        className="glass-card-heavy rounded-2xl p-8 relative overflow-hidden"
      >
        {/* የጥልምም ፓተርን በካርዱ ዳራ */}
        <EthiopianPattern variant="diamonds" opacity={0.02} />
        
        {/* የኢትዮጵያ ቀለማት ግራዲየንት በካርዱ ጠርዝ */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-forest-500 via-gold-500 to-earth-500 opacity-50" />

        {/* ===== የስህተት ማሳወቂያ ===== */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideInRight}
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

          <PremiumInput
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            error={errors.password?.message}
            showPasswordToggle
            value={passwordValue || ''}
            {...register('password')}
          />

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
                <div className={`
                  w-5 h-5 rounded-md border-2 flex items-center justify-center
                  transition-all duration-300
                  ${rememberMe 
                    ? 'bg-gold-500 border-gold-500' 
                    : 'border-border-default group-hover:border-gold-500/50'
                  }
                `}>
                  {rememberMe && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                Remember me
              </span>
            </motion.label>

            <Link
              href="/forgot-password"
              className="text-sm text-gold-500 hover:text-gold-400 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* ===== ሰብሚት ቡቶን ===== */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
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
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
              {/* ሻይመር ውጤት */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
          </motion.div>

          {/* ===== ባዮሜትሪክ አማራጭ ===== */}
          {useBiometric && (
            <motion.button
              type="button"
              initial="hidden"
              animate="visible"
              variants={scaleIn}
              className="w-full h-12 rounded-xl border-2 border-dashed border-gold-500/30 
                         flex items-center justify-center gap-3 text-gold-500 
                         hover:bg-gold-500/5 transition-all duration-300
                         font-medium text-sm"
            >
              <Fingerprint className="w-5 h-5" />
              Authenticate with Biometrics
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
              <span className="bg-surface-raised px-4 text-text-tertiary">
                or continue with
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
                         transition-all duration-300 text-sm font-medium"
            >
              <Github className="w-4 h-4" />
              GitHub
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-11 rounded-xl 
                         border border-border-default hover:border-border-hover
                         bg-surface-secondary hover:bg-surface-hover
                         transition-all duration-300 text-sm font-medium"
            >
              <Chrome className="w-4 h-4" />
              Google
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ===== ምዝገባ ሊንክ ===== */}
      <motion.div 
        className="mt-8 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={3}
      >
        <p className="text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link 
            href="/register" 
            className="text-gold-500 hover:text-gold-400 font-medium 
                       transition-colors inline-flex items-center gap-1 group"
          >
            Create one
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </p>
      </motion.div>

      {/* ===== ፉተር ===== */}
      <motion.div 
        className="mt-10 text-center"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={4}
      >
        <div className="flex items-center justify-center gap-1 mb-3">
          <Shield className="w-3.5 h-3.5 text-text-tertiary" />
          <p className="text-xs text-text-tertiary">
            Protected by enterprise-grade encryption
          </p>
        </div>
        <p className="text-xs text-text-tertiary">
          By signing in, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-text-secondary transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-text-secondary transition-colors">
            Privacy Policy
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
          <div className="animate-ethiopian-spin w-12 h-12" />
          <p className="text-text-secondary text-sm">Loading your experience...</p>
        </motion.div>
      </div>
    }>
      <div className="min-h-screen flex bg-surface-primary">
        {/* ===== ግራ በኩል - ፎርም ===== */}
        <div className="flex-1 flex items-center justify-center px-4 py-12 lg:px-8">
          <LoginForm />
        </div>

        {/* ===== ቀኝ በኩል - የጥልምም ፓተርን ዲስፕሌይ ===== */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden bg-surface-secondary">
          {/* የኢትዮጵያ ጥልምም ፓተርን */}
          <EthiopianPattern variant="cross" opacity={0.03} />
          <EthiopianPattern variant="diamonds" opacity={0.02} />
          
          {/* የቀለም ንጣፎች */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-forest-500/5 blur-3xl" 
               style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '-4s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-earth-500/5 blur-3xl"
               style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '-2s' }} />

          {/* ማዕከላዊ ይዘት */}
          <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { 
                  opacity: 1,
                  transition: { staggerChildren: 0.2, delayChildren: 0.3 }
                }
              }}
            >
              <motion.div
                variants={fadeInUp}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-600 
                           flex items-center justify-center mb-8 shadow-glow-gold mx-auto"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h2 
                variants={fadeInUp}
                className="text-4xl font-bold mb-4 font-cabinet"
              >
                Built for <span className="gradient-text-ethiopian">Creators</span>
              </motion.h2>
              
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-text-secondary max-w-md leading-relaxed"
              >
                Experience a platform where every pixel is crafted with purpose, 
                and every interaction tells a story of innovation.
              </motion.p>

              <motion.div 
                variants={fadeInUp}
                className="mt-12 grid grid-cols-3 gap-8 text-center"
              >
                <div>
                  <div className="text-3xl font-bold gradient-text-gold mb-1">99.9%</div>
                  <div className="text-xs text-text-tertiary">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text-gold mb-1">50K+</div>
                  <div className="text-xs text-text-tertiary">Developers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text-gold mb-1">150+</div>
                  <div className="text-xs text-text-tertiary">Countries</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}