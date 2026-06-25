// Encryption utilities
// TODO: Add crypto utilities
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';

export class CryptoService {
  private static readonly SALT_ROUNDS = 12;
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;
  private static readonly IV_LENGTH = 16;
  private static readonly TAG_LENGTH = 16;

  public static async hashPassword(password: string): Promise<string> {
    return bcryptjs.hash(password, this.SALT_ROUNDS);
  }

  public static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  public static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  public static generateUUID(): string {
    return crypto.randomUUID();
  }

  public static encrypt(
    text: string,
    encryptionKey: string
  ): { encrypted: string; iv: string; tag: string } {
    const key = crypto.scryptSync(encryptionKey, 'salt', this.KEY_LENGTH);
    const iv = crypto.randomBytes(this.IV_LENGTH);
    
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  public static decrypt(
    encrypted: string,
    encryptionKey: string,
    iv: string,
    tag: string
  ): string {
    const key = crypto.scryptSync(encryptionKey, 'salt', this.KEY_LENGTH);
    const decipher = crypto.createDecipheriv(
      this.ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  public static generateApiKey(): string {
    const prefix = 'dgh_';
    const random = crypto.randomBytes(32).toString('base64url');
    const checksum = crypto
      .createHash('sha256')
      .update(random)
      .digest('hex')
      .substring(0, 8);
    
    return `${prefix}${random}.${checksum}`;
  }

  public static hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  public static generateFingerprint(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }
}