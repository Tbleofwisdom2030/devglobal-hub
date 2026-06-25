export type OrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Order {
  id: string;
  userId: string;
  productId: string;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  amountCents: number;
  currency: string;
  status: OrderStatus;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  product?: {
    name: string;
    slug: string;
    imageUrls: string[];
  };
  license?: {
    licenseKey: string;
    status: string;
  };
}

export interface CreateOrderRequest {
  productId: string;
  successUrl?: string;
  cancelUrl?: string;
}