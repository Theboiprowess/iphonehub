import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

// Helper function to fetch current products
async function fetchProducts(filters?: {
  condition?: string;
  maxPrice?: number;
  minPrice?: number;
  storage?: string;
  inStock?: boolean;
  model?: string;
}) {
  const where: any = {
    isActive: true,
    status: 'PUBLISHED',
  };

  if (filters?.condition) {
    // Map condition names
    const conditionMap: Record<string, string> = {
      'boxed': 'BOXED',
      'pre-owned': 'PRE_OWNED',
      'preowned': 'PRE_OWNED',
      'second-hand': 'SECOND_HAND',
      'secondhand': 'SECOND_HAND',
      'used': 'SECOND_HAND',
    };
    where.condition = conditionMap[filters.condition.toLowerCase()] || filters.condition;
  }

  if (filters?.maxPrice) {
    where.price = { lte: filters.maxPrice };
  }

  if (filters?.minPrice) {
    where.price = { gte: filters.minPrice };
  }

  if (filters?.storage) {
    where.variants = {
      some: {
        isActive: true,
        storage: { contains: filters.storage, mode: 'insensitive' },
      },
    };
  }

  if (filters?.model) {
    where.name = { contains: filters.model, mode: 'insensitive' };
  }

  if (filters?.inStock) {
    where.variants = {
      some: {
        isActive: true,
        stock: { gt: 0 },
      },
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      variants: {
        where: { isActive: true },
        orderBy: { price: 'asc' },
      },
      images: {
        where: { type: 'MAIN' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return products;
}

// Extract price from user message
function extractPrice(message: string): { minPrice?: number; maxPrice?: number } | null {
  const lowerMessage = message.toLowerCase();
  
  // Match patterns like "under $500", "less than 400", "between 300 and 500"
  const underMatch = lowerMessage.match(/(?:under|less than|below)\s*\$?(\d+)/);
  if (underMatch) {
    return { maxPrice: parseInt(underMatch[1]) };
  }

  const overMatch = lowerMessage.match(/(?:over|above|more than)\s*\$?(\d+)/);
  if (overMatch) {
    return { minPrice: parseInt(overMatch[1]) };
  }

  const betweenMatch = lowerMessage.match(/between\s*\$?(\d+)\s*and\s*\$?(\d+)/);
  if (betweenMatch) {
    return { 
      minPrice: parseInt(betweenMatch[1]), 
      maxPrice: parseInt(betweenMatch[2]) 
    };
  }

  const exactMatch = lowerMessage.match(/\$?(\d+)\s*(?:dollars?|usd)?/);
  if (exactMatch) {
    const price = parseInt(exactMatch[1]);
    return { minPrice: price - 50, maxPrice: price + 50 };
  }

  return null;
}

// Extract iPhone model from message
function extractModel(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  const models = [
    'iphone 16', 'iphone 16 pro', 'iphone 16 pro max', 'iphone 16 plus',
    'iphone 15', 'iphone 15 pro', 'iphone 15 pro max', 'iphone 15 plus',
    'iphone 14', 'iphone 14 pro', 'iphone 14 pro max', 'iphone 14 plus',
    'iphone 13', 'iphone 13 pro', 'iphone 13 pro max', 'iphone 13 mini',
    'iphone 12', 'iphone 12 pro', 'iphone 12 pro max', 'iphone 12 mini',
    'iphone 11', 'iphone 11 pro', 'iphone 11 pro max',
    'iphone se', 'iphone xr', 'iphone xs', 'iphone x',
  ];

  for (const model of models) {
    if (lowerMessage.includes(model)) {
      return model;
    }
  }

  return null;
}

// Extract condition from message
function extractCondition(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('boxed') || lowerMessage.includes('brand new')) {
    return 'BOXED';
  }
  if (lowerMessage.includes('pre-owned') || lowerMessage.includes('preowned')) {
    return 'PRE_OWNED';
  }
  if (lowerMessage.includes('second-hand') || lowerMessage.includes('secondhand') || lowerMessage.includes('used')) {
    return 'SECOND_HAND';
  }

  return null;
}

// Extract storage from message
function extractStorage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  const storageMatch = lowerMessage.match(/(\d+)\s*gb/i);
  if (storageMatch) {
    return `${storageMatch[1]}GB`;
  }

  return null;
}

// Helper function to fetch knowledge base
async function fetchKnowledgeBase() {
  const articles = await prisma.knowledgeArticle.findMany({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
  });

  return articles;
}

// Helper function to record unanswered question
async function recordUnansweredQuestion(question: string) {
  try {
    // Check if question already exists
    const existing = await prisma.unansweredQuestion.findFirst({
      where: { question: question.toLowerCase() },
    });

    if (!existing) {
      await prisma.unansweredQuestion.create({
        data: {
          question: question.toLowerCase(),
          status: 'PENDING',
          category: 'General',
        },
      });
    }
  } catch (error) {
    console.error('Error recording unanswered question:', error);
  }
}

// Build system prompt with current business data
async function buildSystemPrompt(productContext?: any[]) {
  const products = await fetchProducts({ inStock: true });
  const knowledgeBase = await fetchKnowledgeBase();
  
  const knowledgeText = knowledgeBase.map(kb => 
    `${kb.category}: ${kb.title}\n${kb.content}`
  ).join('\n\n');

  const productSummary = (productContext || products.slice(0, 10)).map(p => 
    `${p.name} - ${p.condition} - $${p.price} - ${p.storage} - ${p.stock} in stock`
  ).join('\n');

  return `You are Prowess, a professional AI customer service representative for iPhone Hub Zimbabwe.

BUSINESS IDENTITY:
- Company: iPhone Hub Zimbabwe
- Location: Based in Masvingo, serving customers across Zimbabwe
- Contact: +263 773 227 172 (Artwell), +263 784 502 347 (Sabeka)
- WhatsApp: +263 773 227 172, +263 784 502 347
- Email: info@iphonehubzimbabwe.co.zw
- Hours: Mon-Fri 9AM-5PM, Sat 10AM-2PM

PRODUCT CATEGORIES:
- BOXED: Brand new, sealed iPhones
- PRE_OWNED: Quality-checked used iPhones
- SECOND_HAND: Budget-friendly used iPhones

RELEVANT PRODUCTS (from database):
${productSummary}

KNOWLEDGE BASE:
${knowledgeText}

CRITICAL RULES:
1. NEVER invent or hallucinate product information, prices, or stock
2. Only use information from the knowledge base or the product list provided above
3. If you don't have verified information, say so and offer human support
4. For product inquiries, provide specific information from the product list
5. If asked about stock, provide current inventory status from the product list
6. For pricing, use actual current prices from the product list
7. For delivery, mention we serve across Zimbabwe
8. For payment, mention EcoCash and other available methods
9. If customer asks to speak to someone, provide WhatsApp options
10. If uncertain about specific details, escalate to human support

RESPONSE STYLE:
- Friendly, professional, and concise
- Confident but admit when you don't know
- Use Zimbabwe-appropriate language
- Never say "As an AI" - speak as the company's representative
- Provide specific, actionable information when available
- When recommending products, explain WHY they fit the customer's needs

WHEN TO ESCALATE:
- Payment disputes
- Refund requests
- Complaints
- Questions requiring business decisions
- When you don't have verified information

ESCALATION RESPONSE:
"I want to make sure you get the correct answer. Let me connect you with our team."

Then provide WhatsApp options for Artwell and Sabeka.`;
}

export async function POST(req: NextRequest) {
  let message = '';
  let conversationHistory: any[] = [];
  
  try {
    const body = await req.json();
    message = body.message || '';
    conversationHistory = body.conversationHistory || [];

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured', requiresConfig: true },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Extract search parameters from message
    const priceRange = extractPrice(message);
    const model = extractModel(message);
    const condition = extractCondition(message);
    const storage = extractStorage(message);

    // Build product filters
    const productFilters: any = { inStock: true };
    if (priceRange?.maxPrice) productFilters.maxPrice = priceRange.maxPrice;
    if (priceRange?.minPrice) productFilters.minPrice = priceRange.minPrice;
    if (model) productFilters.model = model;
    if (condition) productFilters.condition = condition;
    if (storage) productFilters.storage = storage;

    // Fetch relevant products
    const relevantProducts = await fetchProducts(productFilters);

    // Build product context for AI
    const productContext = relevantProducts.slice(0, 5).map((p: any) => {
      const variant = p.variants?.[0];
      const image = p.images?.[0];
      return {
        name: p.name,
        model: p.model || p.name,
        condition: p.condition,
        price: variant?.price || 'N/A',
        storage: variant?.storage || 'N/A',
        colour: variant?.colour || 'N/A',
        stock: variant?.stock || 0,
        image: image?.url || null,
        id: p.id,
        url: `/iphones/${p.id}`,
      };
    });

    // Build system prompt with current business data
    const systemPrompt = await buildSystemPrompt(productContext);

    // Build conversation messages
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ];

    // Add conversation history if available
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        }
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiMessage = completion.choices[0].message;
    const responseText = aiMessage.content || "I'm sorry, I couldn't generate a response.";

    console.log('OpenAI response received successfully');

    // Check if response indicates uncertainty
    const isUncertain = responseText.toLowerCase().includes('not sure') ||
                      responseText.toLowerCase().includes('don\'t have') ||
                      responseText.toLowerCase().includes('uncertain');

    // If uncertain and not about speaking to human, record as unanswered
    if (isUncertain && !message.toLowerCase().includes('speak') && 
        !message.toLowerCase().includes('talk') && !message.toLowerCase().includes('human')) {
      await recordUnansweredQuestion(message);
    }

    // Check if escalation is needed
    const shouldEscalate = message.toLowerCase().includes('speak to someone') ||
                          message.toLowerCase().includes('talk to') ||
                          message.toLowerCase().includes('human') ||
                          message.toLowerCase().includes('complaint') ||
                          message.toLowerCase().includes('refund') ||
                          message.toLowerCase().includes('dispute');

    return NextResponse.json({
      message: responseText,
      shouldEscalate,
      products: shouldEscalate ? [] : productContext,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Record as unanswered on error
    await recordUnansweredQuestion(message);
    
    // Provide professional fallback
    const fallbackResponse = "I'm experiencing some technical difficulties. For immediate assistance, please contact our team on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347\n\nWe're available Mon-Fri: 9AM-5PM, Sat: 10AM-2PM";
    
    return NextResponse.json({
      message: fallbackResponse,
      shouldEscalate: true,
      isFallback: true,
    });
  }
}
