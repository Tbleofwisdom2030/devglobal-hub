'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Card } from '@devglobal/ui';
import { Plus, Trash2 } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  priceCents: z.coerce.number().min(0, 'Price must be positive'),
  currency: z.string().default('USD'),
  category: z.string().optional(),
  tags: z.string().optional(),
  version: z.string().optional(),
  isActive: z.boolean().default(true),
  stripePriceId: z.string().optional(),
  downloadUrl: z.string().optional(),
  coverImage: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormData & { imageUrls?: string[] }>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ProductForm({ defaultValues, onSubmit, isSubmitting, submitLabel = 'Save Product' }: ProductFormProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(defaultValues?.imageUrls || []);
  const [coverImage, setCoverImage] = useState<string>(defaultValues?.coverImage || '');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      currency: 'USD',
      isActive: true,
      name: defaultValues?.name || '',
      slug: defaultValues?.slug || '',
      description: defaultValues?.description || '',
      longDescription: defaultValues?.longDescription || '',
      priceCents: defaultValues?.priceCents || 0,
      category: defaultValues?.category || '',
      tags: Array.isArray(defaultValues?.tags) ? defaultValues.tags.join(', ') : '',
      version: defaultValues?.version || '',
      stripePriceId: defaultValues?.stripePriceId || '',
      downloadUrl: defaultValues?.downloadUrl || '',
    },
  });

  const name = watch('name');
  
  const generateSlug = () => {
    const slug = (name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setValue('slug', slug);
  };

  const addImageUrl = () => setImageUrls([...imageUrls, '']);
  const removeImageUrl = (index: number) => setImageUrls(imageUrls.filter((_, i) => i !== index));
  const updateImageUrl = (index: number, value: string) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    const payload = {
      ...data,
      imageUrls: imageUrls.filter(Boolean),
      coverImage: coverImage || null,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-3xl">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <Input {...register('name')} placeholder="Product name" error={errors.name?.message} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <div className="flex gap-2">
              <Input {...register('slug')} placeholder="product-slug" error={errors.slug?.message} />
              <Button type="button" variant="outline" size="sm" onClick={generateSlug}>Generate</Button>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea {...register('description')} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" placeholder="Short description" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Long Description</label>
            <textarea {...register('longDescription')} rows={6} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" placeholder="Detailed description (Markdown supported)" />
          </div>
        </div>
      </Card>

      {/* Pricing */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price (cents) *</label>
            <Input type="number" {...register('priceCents')} placeholder="4999" error={errors.priceCents?.message} />
            <p className="text-xs text-muted-foreground mt-1">$49.99 = 4999 cents</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select {...register('currency')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stripe Price ID</label>
            <Input {...register('stripePriceId')} placeholder="price_xxx" />
          </div>
        </div>
      </Card>

      {/* Details */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Input {...register('category')} placeholder="Developer Tools" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Version</label>
            <Input {...register('version')} placeholder="1.0.0" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
            <Input {...register('tags')} placeholder="automation, devops, tool" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Download URL</label>
            <Input {...register('downloadUrl')} placeholder="https://..." />
          </div>
        </div>
      </Card>

      {/* Images */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Images</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-2">Cover Image URL</label>
            <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gallery Images</label>
            {imageUrls.map((url, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input value={url} onChange={(e) => updateImageUrl(index, e.target.value)} placeholder="Image URL" />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeImageUrl(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addImageUrl}>
              <Plus className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </div>
        </div>
      </Card>

      {/* Active Toggle */}
      <Card className="p-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded border-input" />
          <span className="text-sm font-medium">Product is active and visible</span>
        </label>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
        <Button type="submit" variant="gradient" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}