import { prisma } from '../../config/database';
import { logger } from '../../config/logger';
import { PaginationHelper, PaginatedResponse } from '../../utils/pagination';
import { Sanitizer } from '../../utils/sanitizer';
import { NotFoundError } from '../../middleware/error-handler';
import { env } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';

// Extend env type for Gemini key
const GEMINI_API_KEY = (env as any).GEMINI_API_KEY || '';

export class ChatService {
  public static async createConversation(userId: string, data: { title?: string; productId?: string }) {
    const id = uuidv4();
    const conversation = await prisma.chatConversation.create({
      data: { id, userId, title: data.title || 'New Conversation', status: 'ACTIVE' },
    });
    const message = await prisma.chatMessage.create({
      data: { id: uuidv4(), conversationId: id, senderType: 'SYSTEM', content: 'Conversation started. How can I help you today?', metadata: {} },
    });
    return { id: conversation.id, userId: conversation.userId, title: conversation.title, status: conversation.status, lastMessageAt: conversation.lastMessageAt, createdAt: conversation.createdAt, updatedAt: conversation.updatedAt, messages: [message] };
  }

  public static async listConversations(userId: string, page: number = 1, limit: number = 20, status?: string): Promise<PaginatedResponse<any>> {
    const where: any = { userId };
    if (status) where.status = status;
    const [conversations, total] = await Promise.all([
      prisma.chatConversation.findMany({ where, take: limit, skip: (page - 1) * limit }),
      prisma.chatConversation.count({ where }),
    ]);
    const formatted = conversations.map((conv: any) => ({ id: conv.id, title: conv.title, status: conv.status, lastMessageAt: conv.lastMessageAt, createdAt: conv.createdAt, updatedAt: conv.updatedAt, lastMessage: conv.messages?.[0] || null }));
    return PaginationHelper.createPaginatedResponse(formatted, total, { page, limit });
  }

  public static async getConversation(conversationId: string, userId?: string) {
    const where: any = { id: conversationId };
    if (userId) where.userId = userId;
    const conversation = await prisma.chatConversation.findFirst({ where });
    if (!conversation) throw new NotFoundError('Conversation');
    const messages = await prisma.chatMessage.findMany({ where: { conversationId }, orderBy: { createdAt: 'asc' } });
    return { ...conversation, messages };
  }

  public static async sendMessage(conversationId: string, userId: string, content: string) {
    const conversation = await prisma.chatConversation.findFirst({ where: { id: conversationId, userId } });
    if (!conversation) throw new NotFoundError('Conversation');

    const userMessage = await prisma.chatMessage.create({
      data: { id: uuidv4(), conversationId, senderType: 'USER', content: Sanitizer.sanitizeHtml(content), metadata: {} },
    });
    await prisma.chatConversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } });

    const recentMessages = await prisma.chatMessage.findMany({ where: { conversationId }, orderBy: { createdAt: 'desc' }, take: 10 });

    // Try AI responses
    let aiContent = await ChatService.callAI(recentMessages.reverse());

    const aiMessage = await prisma.chatMessage.create({
      data: { id: uuidv4(), conversationId, senderType: 'AI', content: aiContent, metadata: { type: 'ai_response' } },
    });
    await prisma.chatConversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } });

    return { userMessage, aiResponse: aiMessage };
  }

  private static async callAI(messages: any[]): Promise<string> {
    // Try OpenRouter first (access to many models)
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.startsWith('sk-or-')) {
      try {
        logger.info('Trying OpenRouter...');
        return await ChatService.callOpenRouter(messages);
      } catch (e: any) {
        logger.warn('OpenRouter failed:', e.message);
      }
    }

    // Try Gemini
    if (GEMINI_API_KEY) {
      try {
        logger.info('Trying Gemini...');
        return await ChatService.callGemini(messages);
      } catch (e: any) {
        logger.warn('Gemini failed:', e.message);
      }
    }

    // Fallback
    const lastMsg = messages.filter((m: any) => m.senderType === 'USER').pop();
    return ChatService.generateSmartResponse(lastMsg?.content || '');
  }

  private static async callOpenRouter(messages: any[]): Promise<string> {
    const systemPrompt = `You are DevBot, a helpful AI support assistant for DevGlobal Hub, a software company selling developer tools. 
Products: DevFlow Pro ($49.99 - workflow automation), CodeScope AI ($79.99 - code analysis), DeployMate ($29.99 - deployment).
Be friendly, professional, and concise. Keep responses under 200 words. Help customers with product questions, licensing, installation, and technical support.`;

    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.senderType === 'USER' ? 'user' : 'assistant' as const,
        content: m.content,
      })),
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'DevGlobal Hub',
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'openai/gpt-4o-mini',
        messages: formattedMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      logger.error('OpenRouter error:', data.error);
      throw new Error(data.error.message || 'OpenRouter API error');
    }

    return data.choices?.[0]?.message?.content || ChatService.generateSmartResponse('');
  }

  private static async callGemini(messages: any[]): Promise<string> {
    const systemPrompt = `You are DevBot, a helpful AI support assistant for DevGlobal Hub. Products: DevFlow Pro ($49.99), CodeScope AI ($79.99), DeployMate ($29.99). Be friendly, professional, and concise.`;

    // Convert to Gemini format
    const contents: any[] = [];
    
    // Add system prompt as user/model exchange
    contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
    contents.push({ role: 'model', parts: [{ text: 'Understood. I will act as DevBot, the helpful support assistant for DevGlobal Hub.' }] });
    
    // Add conversation history
    for (const m of messages) {
      contents.push({
        role: m.senderType === 'USER' ? 'user' : 'model',
        parts: [{ text: m.content }],
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      logger.error('Gemini error:', data.error);
      throw new Error(data.error.message || 'Gemini API error');
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || 
           ChatService.generateSmartResponse(messages.filter((m: any) => m.senderType === 'USER').pop()?.content || '');
  }

  private static generateSmartResponse(userMessage: string): string {
    const msg = (userMessage || '').toLowerCase().trim();

    if (msg.match(/^(hi|hello|hey|yo)/)) {
      return "Hello! 👋 I'm DevBot. I can help with:\n\n🔧 **Products** - DevFlow Pro, CodeScope AI, DeployMate\n📋 **Licensing** - Activation, renewal\n💿 **Installation** - Setup help\n💰 **Pricing** - Costs & purchasing\n\nWhat can I help with?";
    }
    if (msg.includes('product') || msg.includes('offer')) {
      return "🔧 **DevFlow Pro** ($49.99) - Workflow automation\n🤖 **CodeScope AI** ($79.99) - AI code analysis\n🚀 **DeployMate** ($29.99) - One-click deployment\n\n1 year updates + 3 device activations included!";
    }
    if (msg.includes('license') || msg.includes('activate')) {
      return "📋 Manage licenses at Dashboard → My Licenses. Max 3 devices per license. Check for typos if key is invalid.";
    }
    if (msg.includes('install') || msg.includes('download')) {
      return "💿 Go to Dashboard → My Licenses → Download Software. Run installer, enter license key when prompted.";
    }
    if (msg.includes('price') || msg.includes('cost')) {
      return "💰 DevFlow Pro: $49.99 | CodeScope AI: $79.99 | DeployMate: $29.99. One-time payment, 30-day refund.";
    }
    if (msg.match(/(thank|thanks)/)) {
      return "You're welcome! 😊 Anything else?";
    }

    const responses = [
      "I'd love to help! Could you tell me more about what you need?",
      "Let me help! Ask about products, licensing, installation, or pricing.",
      "Please provide more details so I can assist you better.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public static async archiveConversation(conversationId: string, userId: string) {
    await prisma.chatConversation.updateMany({ where: { id: conversationId, userId }, data: { status: 'ARCHIVED' } });
  }
}