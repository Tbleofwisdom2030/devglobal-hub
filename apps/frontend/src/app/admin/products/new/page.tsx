'use client';

import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@devglobal/ui';
import { ProductForm } from '@/components/admin/product-form';

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await apiClient.post('/products', data);
      toast({ title: 'Product created!', variant: 'success' });
      router.push('/admin/products');
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.error, variant: 'destructive' });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create New Product</h1>
        <p className="text-muted-foreground mt-1">Add a new software product to your catalog</p>
      </div>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </div>
  );
}