'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@devglobal/shared';
import { Button, Input, Card } from '@devglobal/ui';
import { apiClient } from '@/lib/api-client';
import { 
  Eye, EyeOff, Loader2, Check, Mail, ArrowRight, 
  Shield, Zap, Users, Sparkles, ArrowLeft 
} from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    try {
      await apiClient.post('/auth/register', {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      setRegisteredEmail(data.email);
      setIsSubmitted(true);
    } catch (error: any) {
      setError(
        error.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  // Show success / check email page after registration
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950">
        <Card className="p-8 max-w-md w-full text-center shadow-xl">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Mail className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Check Your Email! 📧</h1>
          <p className="text-muted-foreground mb-1">We&apos;ve sent a verification link to</p>
          <p className="font-semibold text-lg text-primary mb-6">{registeredEmail}</p>
          
          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-2">
            <p className="text-sm font-medium">Next steps:</p>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-green-500 mt-0.5">1.</span>
              <span>Open your email inbox</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-green-500 mt-0.5">2.</span>
              <span>Click the verification link</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-green-500 mt-0.5">3.</span>
              <span>Log in to your account</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-6">
            Didn&apos;t receive the email? Check your spam folder or try again.
          </p>

          <div className="space-y-3">
            <Button variant="gradient" className="w-full" asChild>
              <Link href="/login">
                Go to Login <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Registration form
  return (
    <div>
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Free forever. No credit card required.
        </div>
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground mt-2">
          Join thousands of developers using DevGlobal Hub
        </p>
      </div>

      <Card className="p-6 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-muted-foreground text-xs">(optional)</span>
            </label>
            <Input
              {...register('fullName')}
              placeholder="John Doe"
              error={errors.fullName?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Create a strong password"
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-muted/50 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground mb-1">Password requirements:</p>
                {Object.entries(passwordChecks).map(([key, valid]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-2 text-xs transition-colors ${
                      valid ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                      valid ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'
                    }`}>
                      <Check className={`h-3 w-3 ${valid ? 'text-green-600' : 'text-muted-foreground/50'}`} />
                    </div>
                    {key === 'length' && 'At least 8 characters'}
                    {key === 'uppercase' && 'One uppercase letter (A-Z)'}
                    {key === 'lowercase' && 'One lowercase letter (a-z)'}
                    {key === 'number' && 'One number (0-9)'}
                    {key === 'special' && 'One special character (@$!%*?&)'}
                  </div>
                ))}
                {/* Strength bar */}
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const passed = Object.values(passwordChecks).filter(Boolean).length;
                    const color = passed >= 5 ? 'bg-green-500' : passed >= 3 ? 'bg-yellow-500' : 'bg-red-500';
                    return (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passed ? color : 'bg-muted'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </Card>

      {/* Trust badges */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="p-3">
          <Shield className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Secure</p>
        </div>
        <div className="p-3">
          <Zap className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Fast Setup</p>
        </div>
        <div className="p-3">
          <Users className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">10K+ Users</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}