'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Input } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';

const kbSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  content: z.string().min(10),
  contentType: z.enum(['FAQ', 'DOCUMENTATION', 'BLOG', 'TUTORIAL']),
  tags: z.string().optional(),
  isPublished: z.boolean().default(true),
});

type KBFormData = z.infer<typeof kbSchema>;

export default function NewKnowledgePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<KBFormData>({
    resolver: zodResolver(kbSchema),
    defaultValues: { contentType: 'DOCUMENTATION', isPublished: true },
  });

  const title = watch('title');

  const onSubmit = async (data: KBFormData) => {
    try {
      const payload = { ...data, tags: data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      await apiClient.post('/knowledge', payload);
      toast({ title: 'Article created!', variant: 'success' });
      router.push('/admin/knowledge');
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.error, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">New Knowledge Article</h1>
        <p className="text-muted-foreground mt-1">Create a new documentation article</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input {...register('title')} error={errors.title?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <div className="flex gap-2">
                <Input {...register('slug')} error={errors.slug?.message} />
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const slug = (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  setValue('slug', slug);
                }}>Generate</Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select {...register('contentType')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="DOCUMENTATION">Documentation</option>
                <option value="FAQ">FAQ</option>
                <option value="TUTORIAL">Tutorial</option>
                <option value="BLOG">Blog</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
            <Input {...register('tags')} placeholder="getting-started, tutorial" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content * (Markdown)</label>
            <textarea {...register('content')} rows={15} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none font-mono" />
            {errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" {...register('isPublished')} className="h-4 w-4 rounded border-input" />
            <span className="text-sm font-medium">Publish immediately</span>
          </label>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="gradient" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Article'}</Button>
        </div>
      </form>
    </div>
  );
}