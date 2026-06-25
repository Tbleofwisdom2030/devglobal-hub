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
    expiresAt?: Date;
  };
  error?: string;
  code?: string;
}

export interface ActivateLicenseDTO {
  licenseKey: string;
  deviceId: string;
  deviceName?: string;
}

export interface ValidateLicenseDTO {
  licenseKey: string;
  productSlug?: string;
}