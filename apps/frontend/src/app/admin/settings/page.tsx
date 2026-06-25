'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Input } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { Save, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const response = await apiClient.get('/site-settings');
      return response.data.data;
    },
  });

  const [form, setForm] = useState({
    siteName: '',
    tagline: '',
    description: '',
    logo: '',
    favicon: '',
    primaryColor: '#4F46E5',
    footerText: '',
    googleAnalyticsId: '',
    socialLinks: {} as Record<string, string>,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || '',
        tagline: settings.tagline || '',
        description: settings.description || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
        primaryColor: settings.primaryColor || '#4F46E5',
        footerText: settings.footerText || '',
        googleAnalyticsId: settings.googleAnalyticsId || '',
        socialLinks: settings.socialLinks || {},
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiClient.put('/admin/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved!', variant: 'success' });
    },
  });

  const handleSocialLinkChange = (platform: string, value: string) => {
    setForm(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [platform]: value } }));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your platform settings</p>
        </div>
        <Button variant="gradient" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">General</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <Input value={form.siteName} onChange={(e) => setForm(prev => ({ ...prev, siteName: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tagline</label>
          <Input value={form.tagline} onChange={(e) => setForm(prev => ({ ...prev, tagline: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Branding</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Logo URL</label>
          <Input value={form.logo} onChange={(e) => setForm(prev => ({ ...prev, logo: e.target.value }))} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Favicon URL</label>
          <Input value={form.favicon} onChange={(e) => setForm(prev => ({ ...prev, favicon: e.target.value }))} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Primary Color</label>
          <div className="flex gap-2">
            <Input value={form.primaryColor} onChange={(e) => setForm(prev => ({ ...prev, primaryColor: e.target.value }))} type="color" className="w-16 h-10 p-1" />
            <Input value={form.primaryColor} onChange={(e) => setForm(prev => ({ ...prev, primaryColor: e.target.value }))} className="flex-1" />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Social Links</h2>
        {['twitter', 'github', 'linkedin', 'facebook', 'instagram'].map(platform => (
          <div key={platform}>
            <label className="block text-sm font-medium mb-2 capitalize">{platform} URL</label>
            <Input
              value={form.socialLinks[platform] || ''}
              onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
              placeholder={`https://${platform}.com/...`}
            />
          </div>
        ))}
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Advanced</h2>
        <div>
          <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
          <Input value={form.googleAnalyticsId} onChange={(e) => setForm(prev => ({ ...prev, googleAnalyticsId: e.target.value }))} placeholder="G-XXXXXXXXXX" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Footer Text</label>
          <textarea value={form.footerText} onChange={(e) => setForm(prev => ({ ...prev, footerText: e.target.value }))} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="gradient" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}