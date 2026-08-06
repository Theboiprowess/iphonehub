"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Smartphone } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = "263773227172";
    const message = "Hello iPhone Hub Masvingo, I would like to enquire about your iPhones.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="relative overflow-hidden bg-[#0E161B] py-20 sm:py-32 wood-texture">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E161B] via-[#0E161B] to-[#1A1814]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(205,181,134,0.18),transparent_70%)]"></div>
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#EBE2C5] font-manrope">
              Your Trusted iPhone Hub in Masvingo.
            </h1>
            <p className="text-lg sm:text-xl text-[#EBE2C5]/90 max-w-2xl">
              Boxed. Pre-Owned. Second-Hand. Quality iPhones, exceptional service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/iphones">
                <Button size="lg" className="w-full sm:w-auto gold-glow">
                  SHOP iPHONES
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]"
                onClick={handleWhatsAppClick}
              >
                <Phone className="mr-2 h-4 w-4" />
                CHAT ON WHATSAPP
              </Button>
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="relative aspect-square lg:aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#5F3C18]/20 to-[#81592B]/20 flex items-center justify-center border border-[#CDB586]/30 gold-glow overflow-hidden">
              {/* iPhone Image Placeholder - Replace with actual iPhone product image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#81592B]/10 to-[#5F3C18]/10"></div>
                <div className="relative z-10 text-center p-8">
                  <Smartphone className="h-32 w-32 mx-auto mb-4 text-[#CDB586] gold-glow" />
                  <p className="text-[#EBE2C5] font-medium text-lg">Premium iPhone Display</p>
                  <p className="text-sm text-[#EBE2C5]/70 mt-2">Upload iPhone product image</p>
                  <p className="text-xs text-[#CDB586]/60 mt-4 max-w-md mx-auto">
                    Add a high-quality iPhone product image to replace this placeholder
                  </p>
                </div>
              </div>
            </div>
            {/* Subtle gold glow effect */}
            <div className="absolute -inset-4 bg-[#CDB586]/5 blur-3xl rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
