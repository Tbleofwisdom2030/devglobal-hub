export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface License {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  licenseKey: string;
  status: LicenseStatus;
  maxActivations: number;
  activationCount: number;
  activatedAt: string | null;
  expiresAt: string | null;
  lastValidatedAt: string | null;
  revokedReason: string | null;
  createdAt: string;
  updatedAt: string;
  product?: {
    name: string;
    slug: string;
    imageUrls: string[];
    version: string;
  };
  order?: {
    amountCents: number;
    currency: string;
    status: string;
    createdAt: string;
  };
}

export interface LicenseValidationResult {
  valid: boolean;
  license?: {
    id: string;
    licenseKey: string;
    status: string;
    productId: string;
    productName: string;
    maxActivations: number;
    activationCount: number;
    expiresAt?: string;
  };
  error?: string;
  code?: string;
}