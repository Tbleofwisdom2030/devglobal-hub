'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, Badge, Button, Skeleton } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { useAuthStore } from '@/stores/auth-store';
import { formatDate } from '@/lib/utils';
import { Calendar, User, ArrowLeft, Heart, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/blog/${slug}`);
      return response.data.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/blog/${post.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-post', slug] });
      toast({ title: 'Liked!', variant: 'success' });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiClient.post(`/blog/${post.id}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-post', slug] });
      setComment('');
      toast({ title: 'Comment added!', variant: 'success' });
    },
  });

  if (isLoading) return <div className="container py-12"><Skeleton className="h-96 w-full" /></div>;
  if (!post) return <div className="container py-12 text-center"><h2 className="text-xl font-bold">Post not found</h2><Link href="/blog" className="text-primary">← Back to blog</Link></div>;

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />Back to blog
      </Link>

      {post.coverImage && <img src={post.coverImage} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-8" />}

      <Badge variant="secondary" className="mb-4">{post.category}</Badge>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
        <span className="flex items-center gap-1"><User className="h-4 w-4" />{post.author}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(post.createdAt)}</span>
      </div>

      <Card className="p-6 mb-8">
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </Card>

      <div className="flex items-center gap-4 py-4 border-t border-b mb-8">
        <Button variant="outline" size="sm" onClick={() => likeMutation.mutate()} disabled={!isAuthenticated}>
          <Heart className="mr-2 h-4 w-4" /> {post.likes || 0} Likes
        </Button>
        <span className="flex items-center text-sm text-muted-foreground">
          <MessageSquare className="mr-2 h-4 w-4" /> {post.comments?.length || 0} Comments
        </span>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Comments ({post.comments?.length || 0})</h3>
        
        {post.comments?.map((c: any) => (
          <div key={c.id} className="flex gap-3 p-4 border rounded-lg">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {c.user?.avatarUrl ? <img src={c.user.avatarUrl} className="h-8 w-8 rounded-full" /> : <User className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-sm font-medium">{c.user?.fullName || 'Anonymous'}</p>
              <p className="text-sm text-muted-foreground mt-1">{c.content}</p>
              <p className="text-xs text-muted-foreground mt-2">{formatDate(c.createdAt)}</p>
            </div>
          </div>
        ))}

        {isAuthenticated ? (
          <div className="flex gap-3">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." rows={3} className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
            <Button onClick={() => commentMutation.mutate(comment)} disabled={!comment.trim() || commentMutation.isPending} size="icon" className="self-end">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">Log in</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
}