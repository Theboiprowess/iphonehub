"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Smartphone, DollarSign, RotateCcw, Truck, CreditCard, Shield, ArrowLeftRight, Phone, Bot, Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./chat-message";
import { ProductCard } from "./product-card";
import type { ProductContext } from "@/lib/support-context";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: ProductContext[];
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("chatSessionId") || crypto.randomUUID();
    }
    return crypto.randomUUID();
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("chatSessionId", sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add greeting message
      setMessages([
        {
          role: "assistant",
          content: "👋 Welcome to iPhone Hub Zimbabwe.\nYour trusted destination for quality iPhones across Zimbabwe. 🇿🇼📱\n\nI'm Prowess your AI assistant. Tell me what you're looking for, and I'll help you find the right iPhone, check availability, compare options, and guide you through your purchase.\n\nHow can I help you today?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const quickActions = [
    { icon: Smartphone, label: "Shop iPhones", action: "What iPhones do you have?" },
    { icon: DollarSign, label: "Check prices", action: "How much is the iPhone 15?" },
    { icon: RotateCcw, label: "Trade in my phone", action: "How does trade-in work?" },
    { icon: Truck, label: "Delivery", action: "Do you deliver in Zimbabwe?" },
    { icon: CreditCard, label: "Payment methods", action: "What payment methods do you accept?" },
    { icon: Shield, label: "Warranty", action: "What is your warranty?" },
    { icon: ArrowLeftRight, label: "Returns", action: "What is your return policy?" },
    { icon: Phone, label: "Contact us", action: "I want to speak to someone" },
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          conversationHistory: messages,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Server error (${response.status}). Please try again or contact us on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347`,
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Non-JSON response:', errorText);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Unexpected response format. Please try again or contact us on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347`,
          },
        ]);
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      console.log('Chat API response:', { status: response.status, data });

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            products: data.products || [],
          },
        ]);

        // If escalation is needed, show WhatsApp option
        if (data.shouldEscalate) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `You can reach our team on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347`,
              },
            ]);
          }, 1000);
        }
      } else {
        // Check if error is due to missing API key
        if (data.requiresConfig) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "I'm currently being configured. Please contact us directly on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347",
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Sorry, I encountered an error: ${data.error || 'Unknown error'}. Please try again or contact us directly on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347`,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Sorry, I'm having trouble connecting: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again later or contact us on WhatsApp:\n\n📱 Artwell: +263 773 227 172\n📱 Sabeka: +263 784 502 347`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
        style={{ position: 'fixed', bottom: '7rem', right: '1.5rem', zIndex: 50 }}
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed z-50 max-w-[400px]"
         style={{ position: 'fixed', bottom: '7rem', right: '1.5rem', left: 'auto', zIndex: 50 }}>
      <Card className="bg-gradient-to-b from-[#0E161B] to-[#0F1A20] border-[#CDB586]/40 shadow-2xl overflow-hidden ring-1 ring-[#CDB586]/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#CDB586] via-[#D4C092] to-[#CDB586] flex items-center justify-between border-b border-[#CDB586]/30 chat-header">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-[#0E161B] rounded-xl flex items-center justify-center shadow-lg ring-2 ring-[#0E161B]/20 overflow-hidden p-0">
                <img 
                  src="/AI.png" 
                  alt="Prowess AI Assistant" 
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-[#CDB586] flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#0E161B] text-base sm:text-lg">Prowess</h3>
                <Sparkles className="h-4 w-4 text-[#0E161B]/60" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-[#0E161B]/60" />
                <p className="text-xs text-[#0E161B]/70 font-medium hidden sm:block">Typically replies instantly</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#0E161B] hover:bg-[#0E161B]/10 rounded-full transition-colors p-2"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-[350px] sm:h-[450px] overflow-y-auto p-4 sm:p-5 bg-gradient-to-b from-[#0E161B]/50 to-[#0F1A20]/30"
             style={{ paddingBottom: '20px', paddingTop: '20px' }}>
          {messages.map((message, index) => (
            <div key={index} className="chat-message-container">
              <ChatMessage role={message.role} content={message.content} />
              {message.products && message.products.length > 0 && (
                <div className="mt-3 space-y-2 !mt-4">
                  {message.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 bg-[#CDB586]/10 rounded-2xl border border-[#CDB586]/20 chat-loading-indicator">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#CDB586] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#CDB586] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[#CDB586] rounded-full animate-bounce delay-200" />
              </div>
              <span className="text-sm text-[#EBE2C5]/80 font-medium chat-loading-text">Prowess is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="chat-quick-actions">
            <p className="text-xs text-[#EBE2C5]/50 font-medium uppercase tracking-wider" style={{ marginBottom: '16px' }}>Quick Actions</p>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.action)}
                  className="flex flex-col items-center gap-1.5 h-auto text-[#EBE2C5] border-[#CDB586]/30 hover:bg-[#CDB586]/15 hover:border-[#CDB586]/50 transition-all duration-200 rounded-xl chat-quick-action-button"
                  style={{ background: 'transparent', border: '1px solid rgba(205, 181, 134, 0.3)', cursor: 'pointer' }}
                >
                  <action.icon className="h-4 w-4 text-[#CDB586] flex-shrink-0" />
                  <span className="text-[10px] font-medium leading-tight text-center break-words w-full line-clamp-2 chat-quick-action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-[#CDB586]/20 bg-gradient-to-b from-[#0E161B]/80 to-[#0F1A20]/60 chat-input-section">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask me anything about iPhones, pricing, delivery..."
              className="bg-[#0E161B]/50 border-[#CDB586]/30 text-[#EBE2C5] placeholder:text-[#EBE2C5]/40 rounded-xl focus:border-[#CDB586]/60 focus:ring-2 focus:ring-[#CDB586]/20 transition-all chat-input-field"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-br from-[#CDB586] to-[#B8A06E] text-[#0E161B] hover:from-[#EBE2C5] hover:to-[#D4C8A8] rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 p-3"
              style={{ cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer', border: 'none' }}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-[#EBE2C5]/30 mt-2 text-center">Powered by AI • Available 24/7</p>
        </div>
      </Card>
    </div>
  );
}
