'use client';

import { useParams } from 'next/navigation';
import { useProduct } from '@/hooks/use-products';
import { Button, Badge, Skeleton } from '@devglobal/ui';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@devglobal/ui';
import { useRouter } from 'next/navigation';
import {
  Package,
  Check,
  Download,
  Shield,
  Clock,
  Users,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: product, isLoading } = useProduct(slug);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    try {
      const response = await apiClient.post('/orders', {
        productId: product?.id,
      });

      if (response.data.data.checkoutUrl) {
        window.location.href = response.data.data.checkoutUrl;
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to create order',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-96 w-full rounded-lg mb-8" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="h-96 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center">
          {product.imageUrls?.[0] ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <Package className="h-32 w-32 text-muted-foreground" />
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}
            {product.version && (
              <Badge variant="outline">v{product.version}</Badge>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="mb-8">
            <span className="text-4xl font-bold">
              {formatPrice(product.priceCents, product.currency)}
            </span>
            <span className="text-muted-foreground ml-2">one-time payment</span>
          </div>

          <div className="flex gap-4 mb-8">
            <Button size="lg" variant="gradient" onClick={handlePurchase}>
              Buy Now
            </Button>
            {product.downloadUrl && (
              <Button size="lg" variant="outline" asChild>
                <a href={product.downloadUrl}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Trial
                </a>
              </Button>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm">Secure license key delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="text-sm">1 year of updates included</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-sm">Up to 3 device activations</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {product.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Long Description */}
      {product.longDescription && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">About {product.name}</h2>
          <div className="prose max-w-none">
            <p>{product.longDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}