'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button, Card, Input } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { Plus, Trash2, Save, Eye } from 'lucide-react';

export default function AdminLandingPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: landing } = useQuery({
    queryKey: ['landing'],
    queryFn: async () => {
      const response = await apiClient.get('/landing');
      return response.data.data;
    },
  });

  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroCtaText: '',
    heroCtaLink: '',
    heroImage: '',
    features: [] as any[],
    testimonials: [] as any[],
  });

  useEffect(() => {
    if (landing) {
      setForm({
        heroTitle: landing.heroTitle || '',
        heroSubtitle: landing.heroSubtitle || '',
        heroCtaText: landing.heroCtaText || '',
        heroCtaLink: landing.heroCtaLink || '',
        heroImage: landing.heroImage || '',
        features: landing.features || [],
        testimonials: landing.testimonials || [],
      });
    }
  }, [landing]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiClient.put('/admin/landing', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landing'] });
      toast({ title: 'Landing page updated!', variant: 'success' });
    },
  });

  const addFeature = () => {
    setForm(prev => ({
      ...prev,
      features: [...prev.features, { icon: 'Zap', title: '', description: '' }],
    }));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...form.features];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, features: updated }));
  };

  const removeFeature = (index: number) => {
    setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const addTestimonial = () => {
    setForm(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: '', role: '', quote: '', avatar: '' }],
    }));
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    const updated = [...form.testimonials];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, testimonials: updated }));
  };

  const removeTestimonial = (index: number) => {
    setForm(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Landing Page Editor</h1>
          <p className="text-muted-foreground mt-1">Customize your homepage content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank"><Eye className="mr-2 h-4 w-4" /> Preview</a>
          </Button>
          <Button variant="gradient" size="sm" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input value={form.heroTitle} onChange={(e) => setForm(prev => ({ ...prev, heroTitle: e.target.value }))} placeholder="Build, Sell, and Support Your Software" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <textarea value={form.heroSubtitle} onChange={(e) => setForm(prev => ({ ...prev, heroSubtitle: e.target.value }))} rows={3} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CTA Text</label>
              <Input value={form.heroCtaText} onChange={(e) => setForm(prev => ({ ...prev, heroCtaText: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CTA Link</label>
              <Input value={form.heroCtaLink} onChange={(e) => setForm(prev => ({ ...prev, heroCtaLink: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Background Image URL</label>
            <Input value={form.heroImage} onChange={(e) => setForm(prev => ({ ...prev, heroImage: e.target.value }))} />
          </div>
        </div>
      </Card>

      {/* Features Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Features</h2>
          <Button variant="outline" size="sm" onClick={addFeature}><Plus className="mr-2 h-4 w-4" /> Add Feature</Button>
        </div>
        <div className="space-y-4">
          {form.features.map((feature: any, index: number) => (
            <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Input value={feature.icon} onChange={(e) => updateFeature(index, 'icon', e.target.value)} placeholder="Icon name (e.g., Code2, Bot, Shield)" />
                <Input value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} placeholder="Feature title" />
                <Input value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} placeholder="Feature description" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFeature(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Testimonials Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Testimonials</h2>
          <Button variant="outline" size="sm" onClick={addTestimonial}><Plus className="mr-2 h-4 w-4" /> Add Testimonial</Button>
        </div>
        <div className="space-y-4">
          {form.testimonials.map((t: any, index: number) => (
            <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Input value={t.name} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} placeholder="Person name" />
                <Input value={t.role} onChange={(e) => updateTestimonial(index, 'role', e.target.value)} placeholder="Role / Company" />
                <textarea value={t.quote} onChange={(e) => updateTestimonial(index, 'quote', e.target.value)} rows={2} className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" placeholder="Testimonial quote" />
                <Input value={t.avatar} onChange={(e) => updateTestimonial(index, 'avatar', e.target.value)} placeholder="Avatar URL" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeTestimonial(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="gradient" onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {saveMutation.isPending ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>
    </div>
  );
}