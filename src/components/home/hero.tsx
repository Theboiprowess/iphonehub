"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Hero() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = "263773227172";
    const message = "Hello iPhone Hub Zimbabwe, I would like to enquire about your iPhones.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="relative overflow-hidden section-spacing bg-[#0E161B] wood-texture">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E161B] via-[#0E161B] to-[#1A1814]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(205,181,134,0.18),transparent_70%)]"></div>
      
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-10 animate-fade-in-up">
            <div className="space-y-5">
              <span className="inline-block px-4 py-1.5 text-xs font-semibold text-[#CDB586] bg-[#CDB586]/10 rounded-full border border-[#CDB586]/30">
                Premium iPhones in Zimbabwe
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#EBE2C5] font-manrope leading-tight">
                Your Trusted iPhone Hub in Zimbabwe
              </h1>
            </div>
            <div className="space-y-5">
              <p className="text-lg sm:text-xl lg:text-2xl text-[#EBE2C5]/80 max-w-2xl leading-relaxed">
                Boxed. Pre-Owned. Second-Hand. Premium iPhones, exceptional service, delivered across Zimbabwe.
              </p>
              <div className="flex items-center gap-2 text-[#CDB586]/80">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Based in Masvingo • Serving Customers Nationwide</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/iphones">
                <Button size="lg" className="w-full sm:w-auto gold-glow font-semibold">
                  SHOP iPHONES
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/trade-in">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B] font-semibold"
                >
                  EXPLORE TRADE-IN
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B] font-semibold"
                onClick={handleWhatsAppClick}
              >
                <Phone className="mr-2 h-4 w-4" />
                CHAT ON WHATSAPP
              </Button>
            </div>
          </div>
          <div className="relative animate-scale-in order-last lg:order-last w-full">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#5F3C18]/20 to-[#81592B]/20 flex items-center justify-center border border-[#CDB586]/30 overflow-hidden shadow-2xl">
              {/* iPhone Image */}
              <Image
                src="/hero-iphone.jpg.jpg"
                alt="Premium iPhone Display"
                fill
                className="object-cover"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
