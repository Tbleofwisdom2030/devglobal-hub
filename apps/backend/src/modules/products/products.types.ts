export interface CreateProductDTO {
  slug: string;
  name: string;
  description?: string;
  longDescription?: string;
  priceCents: number;
  currency?: string;
  category?: string;
  tags?: string[];
  imageUrls?: string[];
  downloadUrl?: string;
  version?: string;
  isActive?: boolean;
  stripePriceId?: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  longDescription?: string;
  priceCents?: number;
  currency?: string;
  category?: string;
  tags?: string[];
  imageUrls?: string[];
  downloadUrl?: string;
  version?: string;
  isActive?: boolean;
  stripePriceId?: string;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  tags?: string[];
}