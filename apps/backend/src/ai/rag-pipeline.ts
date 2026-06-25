// Complete RAG pipeline
// TODO: Add RAG pipeline
import { EmbeddingService } from './embeddings';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface RAGContext {
  content: string;
  source: string;
  relevance: number;
}

export class RAGPipeline {
  public static async retrieveContext(
    query: string,
    topK: number = 5,
    minRelevance: number = 0.7
  ): Promise<RAGContext[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await EmbeddingService.generateEmbedding(query);

      // Search using pgvector
      const results = await prisma.$queryRaw<any[]>`
        SELECT 
          kbe.chunk_text,
          kb.title AS source,
          1 - (kbe.embedding <=> ${queryEmbedding}::vector) AS similarity
        FROM kb_embeddings kbe
        JOIN knowledge_base kb ON kb.id = kbe.kb_article_id
        WHERE kb.is_published = true
          AND 1 - (kbe.embedding <=> ${queryEmbedding}::vector) > ${minRelevance}
        ORDER BY similarity DESC
        LIMIT ${topK}
      `;

      return results.map((row: any) => ({
        content: row.chunk_text,
        source: row.source,
        relevance: Math.round(row.similarity * 100) / 100,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.stack ?? error.message : String(error);
      logger.error(`RAG retrieval failed: ${errorMessage}`);
      return [];
    }
  }

  public static formatContextForPrompt(contexts: RAGContext[]): string {
    if (contexts.length === 0) {
      return 'No relevant documentation found.';
    }

    return contexts
      .map(
        (ctx, index) =>
          `[Document ${index + 1}] (Source: ${ctx.source}, Relevance: ${ctx.relevance})\n${ctx.content}`
      )
      .join('\n\n');
  }

  public static createRAGPrompt(
    systemPrompt: string,
    userQuery: string,
    contexts: RAGContext[]
  ): Array<{ role: 'system' | 'user'; content: string }> {
    const contextText = this.formatContextForPrompt(contexts);

    return [
      {
        role: 'system',
        content: `${systemPrompt}\n\nUse the following documentation to help answer the user's question. If the documentation doesn't contain relevant information, say so and provide a general response.\n\nDocumentation Context:\n${contextText}`,
      },
      {
        role: 'user',
        content: userQuery,
      },
    ];
  }
}