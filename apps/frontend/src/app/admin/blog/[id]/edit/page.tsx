'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Input, Skeleton } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';

const blogSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  content: z.string().min(10),
  excerpt: z.string().optional(),
  coverImage: z.string().optional().or(z.literal('')),
  author: z.string().min(2),
  category: z.string().min(2),
  tags: z.string().optional(),
  isPublished: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const postId = params.id as string;

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', postId],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/admin/all`);
      const posts = response.data.data || [];
      return posts.find((p: any) => p.id === postId);
    },
  });

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  useEffect(() => {
    if (post) {
      setValue('title', post.title);
      setValue('slug', post.slug);
      setValue('content', post.content);
      setValue('excerpt', post.excerpt || '');
      setValue('coverImage', post.coverImage || '');
      setValue('author', post.author);
      setValue('category', post.category);
      setValue('tags', Array.isArray(post.tags) ? post.tags.join(', ') : '');
      setValue('isPublished', post.isPublished);
    }
  }, [post, setValue]);

  const onSubmit = async (data: BlogFormData) => {
    try {
      const payload = { ...data, tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [] };
      await apiClient.put(`/blog/${postId}`, payload);
      toast({ title: 'Post updated!', variant: 'success' });
      router.push('/admin/blog');
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.error, variant: 'destructive' });
    }
  };

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (!post) return <div className="text-center py-12">Post not found</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <p className="text-muted-foreground mt-1">Update: {post?.title}</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input {...register('title')} error={errors.title?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">Slug *</label><Input {...register('slug')} error={errors.slug?.message} /></div>
            <div><label className="block text-sm font-medium mb-2">Category *</label><Input {...register('category')} error={errors.category?.message} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-2">Author *</label><Input {...register('author')} error={errors.author?.message} /></div>
            <div><label className="block text-sm font-medium mb-2">Cover Image URL</label><Input {...register('coverImage')} /></div>
          </div>
          <div><label className="block text-sm font-medium mb-2">Tags</label><Input {...register('tags')} /></div>
          <div><label className="block text-sm font-medium mb-2">Excerpt</label><textarea {...register('excerpt')} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" /></div>
          <div><label className="block text-sm font-medium mb-2">Content * (Markdown)</label><textarea {...register('content')} rows={15} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none font-mono" />{errors.content && <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>}</div>
          <label className="flex items-center gap-2"><input type="checkbox" {...register('isPublished')} className="h-4 w-4 rounded border-input" /><span className="text-sm font-medium">Published</span></label>
        </Card>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" variant="gradient" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Update Post'}</Button>
        </div>
      </form>
    </div>
  );
}