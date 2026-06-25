export interface CreateOrderDTO {
  productId: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}

export interface OrderResponse {
  id: string;
  userId: string;
  productId: string;
  amountCents: number;
  currency: string;
  status: string;
  stripeSessionId?: string;
  stripePaymentId?: string;
  metadata: any;
  createdAt: Date;
  product?: {
    name: string;
    slug: string;
  };
  license?: {
    licenseKey: string;
    status: string;
  };
}