'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { Button, Skeleton } from '@devglobal/ui';
import { ArrowRight, Code2, Bot, Shield, Zap, Cloud, Users } from 'lucide-react';

const iconMap: Record<string, any> = { Code2, Bot, Shield, Zap, Cloud, Users };

export default function HomePage() {
  const { data: landing, isLoading } = useQuery({
    queryKey: ['landing'],
    queryFn: async () => {
      const response = await apiClient.get('/landing');
      return response.data.data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await apiClient.get('/products?limit=3&sortBy=createdAt&sortOrder=desc');
      return response.data.data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="container py-24 space-y-8">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-8 w-1/2 mx-auto" />
        <Skeleton className="h-12 w-48 mx-auto" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-background dark:to-purple-950" />
        {landing?.heroImage && (
          <img src={landing.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="container relative py-24 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Now with AI-powered support
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {landing?.heroTitle || 'Build, Sell, and Support Your Software'}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {landing?.heroSubtitle || ''}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="gradient" asChild>
                <Link href={landing?.heroCtaLink || '/products'}>
                  {landing?.heroCtaText || 'Browse Products'} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {(landing?.features?.length > 0) && (
        <section className="py-24 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                From product listing to customer support, our platform handles it all.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(landing.features || []).map((feature: any, index: number) => {
                const IconComponent = iconMap[feature.icon] || Zap;
                return (
                  <div key={index} className="group relative rounded-2xl border bg-background p-8 hover:shadow-lg transition-all duration-300">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {products && products.length > 0 && (
        <section className="py-24">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground text-lg">Choose the tools that fit your needs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {products.map((product: any, index: number) => (
                <div key={product.id} className={`relative rounded-2xl border bg-background p-8 ${index === 1 ? 'border-primary shadow-lg scale-105' : 'hover:shadow-lg'} transition-all duration-300`}>
                  {index === 1 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">Most Popular</div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${(product.priceCents / 100).toFixed(2)}</span>
                    <span className="text-muted-foreground">/license</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{product.description}</p>
                  <Button className="w-full" variant={index === 1 ? 'gradient' : 'outline'} asChild>
                    <Link href={`/products/${product.slug}`}>Learn More</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust DevGlobal Hub for their software distribution and support needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="secondary" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
              <Link href="/register">Create Free Account</Link>
            </Button>
            <Button size="xl" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/products">View Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}