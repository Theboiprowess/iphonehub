"use client";

import { Button, LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CtaGroup } from "@/components/ui/cta-group";
import { ArrowRight, Phone, MapPin } from "lucide-react";

export function Hero() {
  const handleWhatsAppClick = () => {
    const whatsappNumber = "263773227172";
    const message = "Hello iPhone Hub Zimbabwe, I would like to enquire about your iPhones.";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="relative overflow-hidden section-spacing-hero bg-[#0E161B] wood-texture">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E161B] via-[#0E161B] to-[#1A1814]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(205,181,134,0.18),transparent_70%)]"></div>
      
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-w-0">
          <div className="space-y-8 lg:space-y-12 animate-fade-in-up min-w-0">
            <div className="space-y-6">
              <Badge variant="primary" className="mb-2">
                Premium iPhones in Zimbabwe
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#EBE2C5] font-manrope leading-tight">
                Your Trusted iPhone Hub in Zimbabwe
              </h1>
            </div>
            <div className="space-y-6">
              <p className="text-lg sm:text-xl lg:text-2xl text-[#EBE2C5]/80 leading-relaxed">
                Boxed. Pre-Owned. Second-Hand. Premium iPhones, exceptional service, delivered across Zimbabwe.
              </p>
              <div className="flex items-center gap-2 text-[#CDB586]/80">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Based in Masvingo • Serving Customers Nationwide</span>
              </div>
            </div>
            <CtaGroup size="md" className="pt-4">
              <LinkButton href="/iphones" size="md" goldGlow className="flex-1 sm:flex-none">
                SHOP iPHONES
                <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
              <LinkButton href="/trade-in" variant="secondary" size="md" className="flex-1 sm:flex-none">
                EXPLORE TRADE-IN
              </LinkButton>
              <Button variant="secondary" size="md" className="flex-1 sm:flex-none" onClick={handleWhatsAppClick}>
                <Phone className="mr-2 h-4 w-4" />
                CHAT ON WHATSAPP
              </Button>
            </CtaGroup>
          </div>
          <div className="relative animate-scale-in order-last lg:order-last w-full min-w-0">
            <div className="relative aspect-[181/270] rounded-2xl bg-gradient-to-br from-[#5F3C18]/20 to-[#81592B]/20 flex items-center justify-center border border-[#CDB586]/30 overflow-hidden shadow-2xl" style={{ maxWidth: '400px', margin: '0 auto' }}>
              {/* iPhone Image */}
              <img
                src="/hero image.jpeg"
                alt="Premium iPhone Display"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
