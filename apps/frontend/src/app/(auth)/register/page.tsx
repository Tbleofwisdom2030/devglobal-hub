// Registration with password checks
// TODO: Add registration page
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@devglobal/shared';
import { Button, Input, Card } from '@devglobal/ui';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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
      await registerUser(data.email, data.password, data.fullName);
      router.push('/dashboard');
    } catch (error: any) {
      setError(
        error.response?.data?.error || 'Registration failed. Please try again.'
      );
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground mt-2">
          Get started with DevGlobal Hub today
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name (optional)
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password requirements */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                {Object.entries(passwordChecks).map(([key, valid]) => (
                  <div
                    key={key}
                    className={`flex items-center gap-2 text-xs ${
                      valid ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    <Check
                      className={`h-3 w-3 ${
                        valid ? 'text-green-600' : 'text-muted-foreground'
                      }`}
                    />
                    {key === 'length' && 'At least 8 characters'}
                    {key === 'uppercase' && 'One uppercase letter'}
                    {key === 'lowercase' && 'One lowercase letter'}
                    {key === 'number' && 'One number'}
                    {key === 'special' && 'One special character (@$!%*?&)'}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{' '}
          </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}