'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, Badge, Input, Skeleton } from '@devglobal/ui';
import { formatPrice } from '@/lib/utils';
import { Search, Package, ArrowRight } from 'lucide-react';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  // Fetch products from API
  const { data, isLoading } = useQuery({
    queryKey: ['products', page, search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('limit', '12');
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      
      const response = await apiClient.get(`/products?${params.toString()}`);
      return response.data;
    },
  });

  // Fetch unique categories from products
  const { data: allProducts } = useQuery({
    queryKey: ['all-products-categories'],
    queryFn: async () => {
      const response = await apiClient.get('/products?limit=100');
      return response.data;
    },
  });

  const products = data?.data || [];
  
  // Get unique categories from all products
  const categories = ['All'];
  if (allProducts?.data) {
    allProducts.data.forEach((p: any) => {
      if (p.category && !categories.includes(p.category)) {
        categories.push(p.category);
      }
    });
  }

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Products</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Discover powerful developer tools designed to accelerate your workflow
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              <Skeleton className="h-48 w-full mb-4 rounded-lg" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">
            {search || category !== 'All' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Check back soon for new products!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Product Image */}
                <div className="h-48 rounded-t-lg bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950 dark:to-purple-950 flex items-center justify-center overflow-hidden">
                  {(product.coverImage || product.imageUrls?.[0]) ? (
                    <img
                      src={product.coverImage || product.imageUrls[0]}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Package className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                    {product.version && (
                      <Badge variant="outline" className="text-xs">
                        v{product.version}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-2xl font-bold">
                      {formatPrice(product.priceCents, product.currency)}
                    </span>
                    <span className="text-primary text-sm font-medium inline-flex items-center group-hover:underline">
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-50 hover:bg-accent"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {data.meta.totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(data.meta.totalPages, page + 1))}
            disabled={page === data.meta.totalPages}
            className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-50 hover:bg-accent"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}