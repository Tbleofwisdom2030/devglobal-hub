'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button, Card } from '@devglobal/ui';
import { useToast } from '@devglobal/ui';
import { Upload, Copy, Trash2, Image, File, Check, Loader2, X } from 'lucide-react';

export default function AdminMediaPage() {
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const response = await apiClient.get('/media?limit=100');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast({ title: 'File deleted', variant: 'success' });
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        await apiClient.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast({ title: `${files.length} file(s) uploaded`, variant: 'success' });
    } catch (error: any) {
      toast({ title: 'Upload failed', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: 'URL copied!', variant: 'success' });
  };

  const media = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>
        <p className="text-muted-foreground mt-1">Manage your uploaded files</p>
      </div>

      {/* Upload Area */}
      <Card className="p-12 text-center">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-lg">Uploading...</span>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Click to upload images</p>
              <p className="text-sm text-muted-foreground mt-1">
                PNG, JPG, GIF, WebP up to 10MB
              </p>
            </>
          )}
        </label>
      </Card>

      {/* Media Grid */}
      {media.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item: any) => (
            <Card key={item.id} className="group relative overflow-hidden">
              {item.mimeType?.startsWith('image/') ? (
                <img
                  src={item.url}
                  alt={item.filename}
                  className="h-32 w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                  }}
                />
              ) : (
                <div className="h-32 flex items-center justify-center bg-muted">
                  <File className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
              <div className="p-2">
                <p className="text-xs truncate" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(item.size / 1024)} KB
                </p>
              </div>
              {/* Action buttons */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  onClick={() => copyUrl(item.url)}
                  className="p-1.5 bg-background rounded shadow hover:bg-muted"
                  title="Copy URL"
                >
                  {copied === item.url ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this file?')) {
                      deleteMutation.mutate(item.id);
                    }
                  }}
                  className="p-1.5 bg-background rounded shadow hover:bg-muted"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : !uploading ? (
        <Card className="p-12 text-center">
          <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No files uploaded yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click the upload area above to add images
          </p>
        </Card>
      ) : null}
    </div>
  );
}