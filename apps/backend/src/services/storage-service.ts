import { env } from '../config/env';
import { logger } from '../config/logger';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

let s3Client: any = null;

async function getS3Client() {
  if (s3Client) return s3Client;
  
  if (env.CLOUDFLARE_R2_ENDPOINT && env.CLOUDFLARE_R2_ACCESS_KEY) {
    try {
      const { S3Client } = await import('@aws-sdk/client-s3');
      s3Client = new S3Client({
        region: 'auto',
        endpoint: env.CLOUDFLARE_R2_ENDPOINT,
        credentials: {
          accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY!,
          secretAccessKey: env.CLOUDFLARE_R2_SECRET_KEY || '',
        },
      });
      return s3Client;
    } catch (error) {
      logger.warn('Failed to initialize S3 client, using local storage');
    }
  }
  return null;
}

// Base URL for uploaded files
function getBaseUrl(): string {
  // Use BASE_URL env variable for production, fallback to localhost
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  const port = env.PORT || '4000';
  return `http://localhost:${port}`;
}

export class StorageService {
  public static async uploadFile(
    file: Buffer,
    filename: string,
    contentType: string,
    folder: string = 'media'
  ): Promise<string> {
    const client = await getS3Client();

    if (client && env.CLOUDFLARE_R2_BUCKET) {
      const key = `${folder}/${uuidv4()}-${filename}`;
      const { PutObjectCommand } = await import('@aws-sdk/client-s3');
      
      await client.send(new PutObjectCommand({
        Bucket: env.CLOUDFLARE_R2_BUCKET,
        Key: key,
        Body: file,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000',
      }));

      const url = `${env.CLOUDFLARE_R2_PUBLIC_URL || env.CLOUDFLARE_R2_ENDPOINT}/${key}`;
      logger.info(`File uploaded to R2: ${key}`);
      return url;
    }

    // Fallback: Save to local filesystem
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const localFilename = `${uuidv4()}-${safeFilename}`;
    const localPath = path.join(UPLOAD_DIR, folder);
    
    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }

    const filePath = path.join(localPath, localFilename);
    fs.writeFileSync(filePath, file);

    // Return FULL URL pointing to backend server
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/uploads/${folder}/${localFilename}`;
    logger.info(`File saved locally: ${url}`);
    
    return url;
  }

  public static async deleteFile(urlOrKey: string): Promise<void> {
    // Extract the local path from URL (works for both localhost and production URLs)
    if (urlOrKey.startsWith('http')) {
      try {
        const url = new URL(urlOrKey);
        urlOrKey = url.pathname;
      } catch {
        // Not a valid URL, use as-is
      }
    }

    const client = await getS3Client();

    if (client && env.CLOUDFLARE_R2_BUCKET) {
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      await client.send(new DeleteObjectCommand({
        Bucket: env.CLOUDFLARE_R2_BUCKET,
        Key: urlOrKey,
      }));
      return;
    }

    // Local fallback
    const localPath = path.join(UPLOAD_DIR, urlOrKey.replace('/uploads/', ''));
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
      logger.info(`File deleted locally: ${urlOrKey}`);
    }
  }

  public static getPublicUrl(key: string): string {
    if (key.startsWith('http')) return key;
    if (env.CLOUDFLARE_R2_PUBLIC_URL) {
      return `${env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    }
    return `${getBaseUrl()}/${key}`;
  }
}