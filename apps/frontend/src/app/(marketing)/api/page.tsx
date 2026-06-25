'use client';

import { Card, Badge } from '@devglobal/ui';
import { Code2, Lock, Server } from 'lucide-react';

const endpoints = [
  { method: 'POST', path: '/api/v1/auth/register', description: 'Register a new user account', auth: false, category: 'Authentication' },
  { method: 'POST', path: '/api/v1/auth/login', description: 'Login and receive JWT tokens', auth: false, category: 'Authentication' },
  { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh expired access token', auth: false, category: 'Authentication' },
  { method: 'GET', path: '/api/v1/auth/me', description: 'Get current user profile', auth: true, category: 'Authentication' },
  { method: 'GET', path: '/api/v1/products', description: 'List all products with filtering', auth: false, category: 'Products' },
  { method: 'GET', path: '/api/v1/products/:slug', description: 'Get product details by slug', auth: false, category: 'Products' },
  { method: 'POST', path: '/api/v1/orders', description: 'Create a new order (Stripe checkout)', auth: true, category: 'Orders' },
  { method: 'GET', path: '/api/v1/orders', description: 'List user orders', auth: true, category: 'Orders' },
  { method: 'GET', path: '/api/v1/licenses', description: 'List user licenses', auth: true, category: 'Licenses' },
  { method: 'POST', path: '/api/v1/licenses/validate', description: 'Validate a license key', auth: false, category: 'Licenses' },
  { method: 'GET', path: '/api/v1/tickets', description: 'List user support tickets', auth: true, category: 'Tickets' },
  { method: 'POST', path: '/api/v1/tickets', description: 'Create a new support ticket', auth: true, category: 'Tickets' },
];

const methodColors: Record<string, string> = {
  GET: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
  POST: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
  DELETE: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
};

export default function APIPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <Code2 className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">API Reference</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Complete REST API reference for integrating with DevGlobal Hub
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 p-6 rounded-lg border bg-muted/50">
          <h2 className="font-semibold mb-2 flex items-center gap-2">
            <Server className="h-5 w-5" />
            Base URL
          </h2>
          <code className="text-sm bg-background px-3 py-1.5 rounded-md block mt-2">
            https://api.devglobalhub.com/api/v1
          </code>
        </div>

        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Badge className={`font-mono text-xs ${methodColors[endpoint.method] || ''}`}>
                  {endpoint.method}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-medium">{endpoint.path}</code>
                    {endpoint.auth && (
                      <span className="inline-flex" aria-label="Requires authentication">
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {endpoint.category}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}