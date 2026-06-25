export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  longDescription: string | null;
  priceCents: number;
  currency: string;
  category: string | null;
  tags: string[];
  imageUrls: string[];
  downloadUrl: string | null;
  version: string | null;
  isActive: boolean;
  stripePriceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  currency: string;
  category: string | null;
  tags: string[];
  imageUrls: string[];
  version: string | null;
  isActive: boolean;
}

export interface ProductFilter {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}