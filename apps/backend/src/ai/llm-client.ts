// OpenAI & LangChain integration
// TODO: Add LLM client
import OpenAI from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import { env } from '../config/env';
import { logger } from '../config/logger';

class LLMClient {
  private static instance: OpenAI;
  private static langchainModel: ChatOpenAI;

  public static getInstance(): OpenAI {
    if (!LLMClient.instance) {
      if (!env.OPENAI_API_KEY) {
        logger.warn('OpenAI API key not configured. AI features will be disabled.');
        throw new Error('OpenAI API key not configured');
      }

      LLMClient.instance = new OpenAI({
        apiKey: env.OPENAI_API_KEY,
        maxRetries: 3,
        timeout: 60000,
      });

      logger.info('OpenAI client initialized');
    }

    return LLMClient.instance;
  }

  public static getLangChainModel(temperature: number = 0.7): ChatOpenAI {
    if (!LLMClient.langchainModel) {
      LLMClient.langchainModel = new ChatOpenAI({
        openAIApiKey: env.OPENAI_API_KEY,
        modelName: env.OPENAI_MODEL,
        temperature,
        maxTokens: 2000,
        streaming: true,
      });
    }

    return LLMClient.langchainModel;
  }

  public static async generateCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    options?: {
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    }
  ): Promise<string> {
    const openai = LLMClient.getInstance();

    try {
      const response = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
        stream: false,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error({ err }, 'OpenAI completion failed');
      throw err;
    }
  }

  public static async generateStreamingCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    onToken: (token: string) => void,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    const openai = LLMClient.getInstance();
    let fullResponse = '';

    try {
      const stream = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          onToken(content);
        }
      }

      return fullResponse;
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      logger.error({ err }, 'OpenAI streaming failed');
      throw err;
    }
  }
}

export { LLMClient };