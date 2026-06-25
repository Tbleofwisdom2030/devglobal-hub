'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, Badge, Input, Skeleton } from '@devglobal/ui';
import { formatDate } from '@/lib/utils';
import { Search, Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['blog', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), limit: '12' });
      if (search) params.set('search', search);
      const response = await apiClient.get(`/blog?${params.toString()}`);
      return response.data;
    },
  });

  const posts = data?.data || [];

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground text-lg">Insights, updates, and guides from the DevGlobal Hub team</p>
      </div>

      <div className="relative max-w-md mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 p-6 h-full">
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="h-40 w-full object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform" />
                )}
                <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(post.createdAt)}</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                {post.excerpt && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>}
                <span className="text-primary text-sm font-medium inline-flex items-center">
                  Read more <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 && !isLoading && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
        </Card>
      )}
    </div>
  );
}