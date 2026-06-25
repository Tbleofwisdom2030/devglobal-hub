// Vector embedding generation
// TODO: Add embeddings logic
import OpenAI from 'openai';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { prisma } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class EmbeddingService {
  private static openai: OpenAI;

  private static getClient(): OpenAI {
    if (!EmbeddingService.openai) {
      EmbeddingService.openai = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
      });
    }
    return EmbeddingService.openai;
  }

  public static async generateEmbedding(text: string): Promise<number[]> {
    const openai = this.getClient();

    try {
      const response = await openai.embeddings.create({
        model: env.OPENAI_EMBEDDING_MODEL,
        input: text.replace(/\n/g, ' ').trim(),
      });

      return response.data[0].embedding;
    } catch (error) {
      logger.error('Failed to generate embedding: ' + String(error));
      throw error;
    }
  }

  public static async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const openai = this.getClient();

    try {
      const response = await openai.embeddings.create({
        model: env.OPENAI_EMBEDDING_MODEL,
        input: texts.map((t) => t.replace(/\n/g, ' ').trim()),
      });

      return response.data.map((d) => d.embedding);
    } catch (error) {
      logger.error('Failed to generate embeddings: ' + String(error));
      throw error;
    }
  }

  public static chunkText(
    text: string,
    chunkSize: number = 1000,
    overlap: number = 200
  ): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      
      // Try to break at a sentence boundary
      let chunk = text.substring(startIndex, endIndex);
      
      if (endIndex < text.length) {
        const lastPeriod = chunk.lastIndexOf('.');
        const lastNewline = chunk.lastIndexOf('\n');
        const breakPoint = Math.max(lastPeriod, lastNewline);
        
        if (breakPoint > chunkSize * 0.5) {
          chunk = chunk.substring(0, breakPoint + 1);
        }
      }

      chunks.push(chunk.trim());
      startIndex += chunk.length - overlap;
    }

    return chunks.filter((c) => c.length > 0);
  }

  public static async generateAndStoreEmbeddings(
    articleId: string,
    content: string
  ): Promise<void> {
    const chunks = this.chunkText(content);

    if (chunks.length === 0) return;

    // Generate embeddings in batches of 20
    const batchSize = 20;
    
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const embeddings = await this.generateEmbeddings(batch);

      // Store embeddings
      const data = batch.map((chunkText, index) => ({
        id: uuidv4(),
        kbArticleId: articleId,
        chunkText,
        chunkIndex: i + index,
        embedding: embeddings[index],
      }));

      await prisma.kbEmbedding.createMany({ data });

      logger.info(`Stored ${data.length} embeddings for article ${articleId}`);
    }
  }
}