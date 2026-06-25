'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@devglobal/ui';
import { ProductForm } from '@/components/admin/product-form';
import { Skeleton } from '@devglobal/ui';
import { useEffect, useState } from 'react';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Fetch all products and find the one with matching ID
        const response = await apiClient.get('/products?limit=100');
        const products = response.data.data || [];
        const found = products.find((p: any) => p.id === productId);
        if (found) {
          setProduct(found);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (data: any) => {
    try {
      await apiClient.put(`/products/${productId}`, data);
      toast({ title: 'Product updated!', variant: 'success' });
      router.push('/admin/products');
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.response?.data?.error || 'Failed to update', 
        variant: 'destructive' 
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-1">Update: {product?.name}</p>
      </div>
      <ProductForm 
        defaultValues={product} 
        onSubmit={handleSubmit} 
        submitLabel="Update Product" 
      />
    </div>
  );
}