export interface CreateArticleDTO {
  title: string;
  content: string;
  contentType: 'FAQ' | 'DOCUMENTATION' | 'BLOG' | 'TUTORIAL';
  productId?: string;
  tags?: string[];
  slug: string;
  isPublished?: boolean;
}

export interface UpdateArticleDTO {
  title?: string;
  content?: string;
  contentType?: 'FAQ' | 'DOCUMENTATION' | 'BLOG' | 'TUTORIAL';
  productId?: string;
  tags?: string[];
  isPublished?: boolean;
}

export interface SearchResult {
  article: {
    id: string;
    title: string;
    slug: string;
    contentType: string;
    tags: string[];
    productName?: string;
  };
  relevance: number;
  snippet: string;
}