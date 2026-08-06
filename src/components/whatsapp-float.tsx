"use client";

import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = (name: string, number: string) => {
    const whatsappNumber = `263${number.replace(/^0/, "")}`;
    const message = "Hello iPhone Hub Masvingo, I would like to enquire about your iPhones.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-20 right-0 space-y-3 animate-fade-in-up">
          <button
            onClick={() => handleWhatsAppClick("Artwell", "773227172")}
            className="flex items-center gap-3 bg-[#0E161B] border border-[#CDB586] text-[#EBE2C5] px-4 py-3 rounded-lg shadow-lg hover:bg-[#1A1814] transition-all w-56"
          >
            <div className="h-10 w-10 rounded-full bg-[#CDB586] text-[#0E161B] flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Artwell</p>
              <p className="text-xs text-[#EBE2C5]/70">0773227172</p>
            </div>
          </button>
          <button
            onClick={() => handleWhatsAppClick("Sabeka", "784502347")}
            className="flex items-center gap-3 bg-[#0E161B] border border-[#CDB586] text-[#EBE2C5] px-4 py-3 rounded-lg shadow-lg hover:bg-[#1A1814] transition-all w-56"
          >
            <div className="h-10 w-10 rounded-full bg-[#CDB586] text-[#0E161B] flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm">Sabeka</p>
              <p className="text-xs text-[#EBE2C5]/70">0784502347</p>
            </div>
          </button>
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
        aria-label="Chat on WhatsApp"
      >
        <div className="absolute inset-0 bg-[#CDB586] rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative bg-[#0E161B] border-2 border-[#CDB586] text-[#CDB586] p-4 rounded-full shadow-lg hover:bg-[#1A1814] transition-all duration-300 group-hover:scale-110 gold-glow">
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </div>
      </button>
    </div>
  );
}
