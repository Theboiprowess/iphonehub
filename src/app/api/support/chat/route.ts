import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Add fallback response system
const getFallbackResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('iphone') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "We have various iPhone models available including iPhone 15, 14, 13, and earlier models. Prices vary by condition (boxed, pre-owned, second-hand) and storage capacity. Would you like me to connect you with our team for specific pricing?";
  }
  
  if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping') || lowerMessage.includes('deliver')) {
    return "Yes, we deliver throughout Zimbabwe! Our delivery team can get your iPhone to you safely. For delivery details and costs, please contact our team directly.";
  }
  
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('ecocash')) {
    return "We accept various payment methods including EcoCash, bank transfers, and cash. For payment assistance, our team can guide you through the process.";
  }
  
  if (lowerMessage.includes('warranty') || lowerMessage.includes('guarantee')) {
    return "We offer warranty on our devices depending on the condition and type of iPhone. For specific warranty information, please speak with our team.";
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('speak') || lowerMessage.includes('talk') || lowerMessage.includes('human')) {
    return "I'd be happy to connect you with our team! You can reach us on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347\n\nWe're available Mon-Fri: 9AM-5PM, Sat: 10AM-2PM";
  }
  
  return "I'm currently experiencing some technical difficulties, but I'd love to help you! For immediate assistance, please contact our team on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347\n\nOr you can try asking me about our iPhones, pricing, delivery, or payment methods.";
};

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

    // Build conversation messages
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are Prowess, a helpful AI support agent for iPhone Hub Zimbabwe, a premium iPhone retailer in Zimbabwe.

BUSINESS INFORMATION:
- Name: iPhone Hub Zimbabwe
- Email: info@iphonehubzimbabwe.co.zw
- Phone: +263 773 227 172
- WhatsApp: +263 773 227 172 (Artwell), +263 784 502 347 (Sabeka)
- Location: Zimbabwe
- Opening Hours: Mon-Fri: 9AM-5PM, Sat: 10AM-2PM

IMPORTANT RULES:
1. Be friendly, professional, and concise
2. If customer asks to speak to someone, suggest WhatsApp contact
3. For product inquiries, mention we have various iPhone models (box, pre-owned, second-hand)
4. For prices, mention prices vary by condition and storage
5. For delivery, mention we deliver in Zimbabwe
6. For payment, mention we accept various payment methods
7. If you don't have specific information, offer to connect with the team

TONE:
- Friendly and approachable
- Professional and knowledgeable
- Confident but humble (admit when you don't know)
- Concise (don't write long responses)
- Premium brand voice`,
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

    // Check if escalation is needed
    const shouldEscalate = message.toLowerCase().includes('speak to someone') ||
                          message.toLowerCase().includes('talk to') ||
                          message.toLowerCase().includes('human') ||
                          message.toLowerCase().includes('complaint');

    return NextResponse.json({
      message: responseText,
      shouldEscalate,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Use fallback response instead of error
    const fallbackResponse = getFallbackResponse(message);
    
    return NextResponse.json({
      message: fallbackResponse,
      shouldEscalate: message.toLowerCase().includes('speak to someone') ||
                     message.toLowerCase().includes('talk to') ||
                     message.toLowerCase().includes('human') ||
                     message.toLowerCase().includes('complaint'),
      isFallback: true,
    });
  }
}
