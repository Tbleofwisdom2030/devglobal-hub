// License management
// TODO: Add license management
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card, Badge, Button } from '@devglobal/ui';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Key, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function LicensesPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['licenses'],
    queryFn: async () => {
      const response = await apiClient.get('/licenses?limit=50');
      return response.data;
    },
  });

  const licenses = data?.data || [];

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (licenses.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No licenses yet</h2>
        <p className="text-muted-foreground mb-4">
          Purchase a product to get your license key.
        </p>
        <Button variant="gradient" onClick={() => window.location.href = '/products'}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Licenses</h1>
        <p className="text-muted-foreground mt-1">
          Manage your software licenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licenses.map((license: any) => (
          <Card key={license.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {license.product?.name || 'Unknown Product'}
                </h3>
                {license.product?.version && (
                  <p className="text-sm text-muted-foreground">
                    Version {license.product.version}
                  </p>
                )}
              </div>
              <Badge className={getStatusColor(license.status)}>
                {license.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  License Key
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono">
                    {license.licenseKey}
                  </code>
                  <button
                    onClick={() => handleCopyKey(license.licenseKey)}
                    className="p-2 rounded-md hover:bg-muted transition-colors"
                    title="Copy license key"
                  >
                    {copiedKey === license.licenseKey ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs text-muted-foreground">
                    Activations
                  </label>
                  <p>
                    {license.activationCount} / {license.maxActivations}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">
                    Expires
                  </label>
                  <p>
                    {license.expiresAt
                      ? formatDate(license.expiresAt)
                      : 'Never'}
                  </p>
                </div>
              </div>

              {license.activatedAt && (
                <div className="text-sm">
                  <label className="text-xs text-muted-foreground">
                    Activated
                  </label>
                  <p>{formatDate(license.activatedAt)}</p>
                </div>
              )}
            </div>

            {license.product?.downloadUrl && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                asChild
              >
                <a
                  href={license.product.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Download Software
                </a>
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}