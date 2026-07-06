'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button, Card } from '@devglobal/ui';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    apiClient.post('/auth/verify-email', { token })
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified successfully! You can now log in.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Verifying Email...</h1>
            <p className="text-muted-foreground">Please wait while we verify your email address.</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Email Verified!</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <Button variant="gradient" size="lg" onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Verification Failed</h1>
            <p className="text-muted-foreground mb-6">{message}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.push('/login')}>
                Back to Login
              </Button>
              <Button variant="gradient" onClick={() => router.push('/register')}>
                Register Again
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md w-full text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Loading...</h1>
        </Card>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}