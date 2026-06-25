'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { formatDate } from '@/lib/utils';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function AdminBlogPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['admin-blog', page],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/admin/all?page=${page}&limit=20`);
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/blog/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog'] });
      toast({ title: 'Post deleted', variant: 'success' });
    },
  });

  const posts = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-1">Manage your blog content</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Link>
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium">Title</th>
                <th className="text-left p-4 text-sm font-medium">Category</th>
                <th className="text-left p-4 text-sm font-medium">Status</th>
                <th className="text-left p-4 text-sm font-medium">Likes</th>
                <th className="text-left p-4 text-sm font-medium">Date</th>
                <th className="text-right p-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: any) => (
                <tr key={post.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">/{post.slug}</p>
                  </td>
                  <td className="p-4"><Badge variant="secondary">{post.category}</Badge></td>
                  <td className="p-4">
                    <Badge variant={post.isPublished ? 'success' : 'secondary'}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">{post.likes}</td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(post.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {post.isPublished && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if (confirm('Delete this post?')) deleteMutation.mutate(post.id);
                      }}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No posts yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}