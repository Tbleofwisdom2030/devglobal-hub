'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Badge } from '@devglobal/ui';
import { formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default function AdminKnowledgePage() {
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ['admin-knowledge', page],
    queryFn: async () => {
      const response = await apiClient.get(`/knowledge?page=${page}&limit=20`);
      return response.data;
    },
  });

  const articles = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">Manage documentation and FAQs</p>
        </div>
        <Button variant="gradient" asChild>
          <Link href="/admin/knowledge/new">
            <Plus className="mr-2 h-4 w-4" /> New Article
          </Link>
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium">Title</th>
                <th className="text-left p-4 text-sm font-medium">Type</th>
                <th className="text-left p-4 text-sm font-medium">Status</th>
                <th className="text-left p-4 text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article: any) => (
                <tr key={article.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{article.title}</td>
                  <td className="p-4"><Badge variant="secondary">{article.contentType}</Badge></td>
                  <td className="p-4">
                    <Badge variant={article.isPublished ? 'success' : 'secondary'}>
                      {article.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{formatDate(article.createdAt)}</td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No articles yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}