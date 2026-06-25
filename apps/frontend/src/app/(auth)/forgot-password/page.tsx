// Password reset
// TODO: Add forgot password page
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@devglobal/shared';
import { Button, Input, Card } from '@devglobal/ui';
import { apiClient } from '@/lib/api-client';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError('');
    try {
      await apiClient.post('/auth/forgot-password', data);
      setIsSubmitted(true);
    } catch (error: any) {
      setError(
        error.response?.data?.error || 'Something went wrong. Please try again.'
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6">
          <Mail className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-muted-foreground mb-6">
          If an account with that email exists, we've sent a password reset link.
          Please check your inbox and spam folder.
        </p>
        <Button variant="outline" asChild>
          <Link href="/login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email and we'll send you a reset link
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
              Email Address
            </label>
            <Input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              error={errors.email?.message}
            />
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
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="inline h-3 w-3 mr-1" />
            Back to login
          </Link>
        </div>
      </Card>
    </div>
  );
}