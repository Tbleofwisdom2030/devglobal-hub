import { z } from 'zod';

export const validateLicenseSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required'),
  productSlug: z.string().optional(),
});

export const activateLicenseSchema = z.object({
  licenseKey: z.string().min(1, 'License key is required'),
  deviceId: z.string().min(1, 'Device ID is required'),
  deviceName: z.string().max(100).optional(),
});

export const revokeLicenseSchema = z.object({
  reason: z.string().min(10, 'Revocation reason must be at least 10 characters').max(500),
});