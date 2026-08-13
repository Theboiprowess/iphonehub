"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { ShieldCheck, ScanSearch, Layers3, Headphones, Package, BadgeCheck, Smartphone, Phone } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      {/* Hero Section */}
      <section className="py-20 sm:py-24 lg:py-32 bg-[#0E161B] wood-texture">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EBE2C5] font-manrope leading-tight">
                Your Trusted iPhone Hub in Zimbabwe
              </h1>
              <p className="text-lg sm:text-xl text-[#EBE2C5]/80 leading-relaxed max-w-2xl">
                iPhone Hub Zimbabwe is a dedicated iPhone retail destination serving customers across Zimbabwe. We offer a range of boxed, pre-owned and second-hand iPhones, giving customers different options based on their preferences and budget.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#5F3C18]/20 to-[#81592B]/20 flex items-center justify-center border border-[#CDB586]/30 gold-glow overflow-hidden">
                <img 
                  src="/hero-iphone.jpg.jpg"
                  alt="iPhone Hub Store"
                  className="w-full h-full object-contain p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-spacing bg-[#F7F5EF]">
        <div className="site-container">
          <SectionHeader 
            title="Our Mission"
            subtitle="Making quality iPhones more accessible with a professional, transparent buying experience"
          />
          <div className="text-center">
            <div className="bg-[#0E161B] rounded-2xl p-8 lg:p-12 border border-[#CDB586]/30 gold-glow">
              <p className="text-[#EBE2C5] text-lg leading-relaxed mb-6">
                At iPhone Hub Zimbabwe, our mission is to bridge the gap between premium technology and accessibility. We believe that everyone deserves access to quality iPhones without compromising on trust, transparency, or customer service.
              </p>
              <p className="text-[#EBE2C5] text-lg leading-relaxed mb-6">
                We are committed to providing Zimbabwe with a reliable source of boxed, pre-owned, and second-hand iPhones that meet the highest standards of quality. Every device we offer undergoes thorough inspection and verification to ensure our customers receive products they can trust.
              </p>
              <p className="text-[#EBE2C5] text-lg leading-relaxed mb-6">
                Our dedicated team works tirelessly to create a seamless buying experience, from the moment you browse our catalog to the day you receive your device. We're not just selling iPhones – we're building lasting relationships with our customers based on honesty, integrity, and exceptional service.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#CDB586]/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#CDB586] mb-2">100%</div>
                  <div className="text-[#EBE2C5]/80 text-sm">Quality Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#CDB586] mb-2">1000+</div>
                  <div className="text-[#EBE2C5]/80 text-sm">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#CDB586] mb-2">24/7</div>
                  <div className="text-[#EBE2C5]/80 text-sm">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-spacing bg-[#F7F5EF]">
        <div className="site-container">
          <SectionHeader 
            title="What We Offer"
            subtitle="Boxed, Pre-Owned, and Second-Hand iPhones to fit every budget"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              <Card className="bg-[#0E161B] border-[#CDB586] hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-6 text-center">
                  <div className="h-16 w-16 rounded-xl bg-[#CDB586] text-[#0E161B] flex items-center justify-center mb-5 mx-auto">
                    <Package className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-[#EBE2C5] text-xl">BOXED iPHONES</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#EBE2C5]/80 leading-relaxed">
                    For customers looking for boxed devices and a premium new-device experience.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#81592B] to-[#5F3C18] border-[#EBE2C5] hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-6 text-center">
                  <div className="h-16 w-16 rounded-xl bg-[#CDB586] text-[#0E161B] flex items-center justify-center mb-5 mx-auto">
                    <BadgeCheck className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-[#EBE2C5] text-xl">PRE-OWNED iPHONES</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#EBE2C5]/80 leading-relaxed">
                    Carefully selected devices for customers who want quality and value at a more accessible price.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#5F3C18] border-[#CDB586] hover:shadow-xl transition-all h-full">
                <CardHeader className="pb-6 text-center">
                  <div className="h-16 w-16 rounded-xl bg-[#CDB586] text-[#0E161B] flex items-center justify-center mb-5 mx-auto">
                    <Smartphone className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-[#EBE2C5] text-xl">SECOND-HAND iPHONES</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#EBE2C5]/80 leading-relaxed">
                    Affordable iPhone options for customers working within different budgets.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
      </section>

      {/* Our Approach */}
      <section className="section-spacing bg-[#EBE2C5]">
        <div className="site-container">
          <SectionHeader 
            title="Our Approach"
            subtitle="Quality, Transparency, Choice, and Customer Service"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              <Card className="bg-[#F7F5EF] border-[#CDB586] hover:shadow-lg transition-all h-full">
                <CardHeader className="pb-6 text-center">
                  <div className="h-16 w-16 rounded-xl bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-5 mx-auto">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-[#0E161B] text-lg">QUALITY</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#5F3C18] leading-relaxed">
                    We aim to provide customers with quality devices and clear information about the condition of each phone.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#F7F5EF] border-[#CDB586] hover:shadow-lg transition-all h-full">
                <CardHeader className="pb-6 text-center">
                  <div className="h-16 w-16 rounded-xl bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-5 mx-auto">
                    <ScanSearch className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-[#0E161B] text-lg">TRANSPARENCY</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#5F3C18] leading-relaxed">
                    Customers should be able to understand what they are buying, including model, storage, condition and other relevant device information.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#F7F5EF] border-[#CDB586] hover:shadow-lg transition-all h-full">
                <CardHeader className="pb-6 text-center">
                  <div className="h-16 w-16 rounded-xl bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-5 mx-auto">
                    <Layers3 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-[#0E161B] text-lg">CHOICE</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#5F3C18] leading-relaxed">
                    Different customers have different needs and budgets, which is why iPhone Hub offers boxed, pre-owned and second-hand options.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#F7F5EF] border-[#CDB586] hover:shadow-lg transition-all h-full">
                <CardHeader className="pb-6 text-center">
                  <div className="h-16 w-16 rounded-xl bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-5 mx-auto">
                    <Headphones className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-[#0E161B] text-lg">CUSTOMER SERVICE</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#5F3C18] leading-relaxed">
                    Our team is available to help customers choose a device that suits their needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 bg-[#0E161B] wood-texture content-center">
        <div className="site-container">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#EBE2C5] font-manrope">
              Ready to Find Your Next iPhone?
            </h2>
            <p className="text-lg text-[#EBE2C5]/80 mb-10 max-w-2xl mx-auto">
              Browse our available iPhones or speak directly with our team on WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/iphones">
                <Button size="lg" className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                  SHOP iPHONES
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]"
                onClick={() => {
                  const whatsappNumber = "263773227172";
                  const message = "Hello iPhone Hub Zimbabwe, I would like to enquire about your iPhones.";
                  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                CHAT ON WHATSAPP
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section-spacing bg-[#F7F5EF]">
        <div className="site-container">
          <SectionHeader 
            title="Meet Our Leadership"
            subtitle="Meet the people behind iPhone Hub Zimbabwe"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 justify-items-center">
              {/* Artwell Gwata */}
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 rounded-2xl flex items-center justify-center border-2 border-[#CDB586] gold-glow overflow-hidden mb-6">
                  <img 
                    src="/ceo2.jpeg" 
                    alt="Artwell Gwata - CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-semibold text-[#0E161B]">Artwell Gwata</h3>
                  <p className="text-[#CDB586] font-medium">CEO — iPhone Hub Zimbabwe</p>
                  <div className="bg-[#EBE2C5] border border-[#CDB586]/30 rounded-lg p-4">
                    <p className="text-sm text-[#5F3C18] italic leading-relaxed">
                      Leading iPhone Hub Zimbabwe with a commitment to quality, transparency, and exceptional customer service across Zimbabwe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sabeka */}
              <div className="flex flex-col items-center">
                <div className="w-64 h-64 rounded-2xl flex items-center justify-center border-2 border-[#CDB586] gold-glow overflow-hidden mb-6">
                  <img 
                    src="/ceo1.jpeg" 
                    alt="Sabeka - CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-semibold text-[#0E161B]">Sabeka</h3>
                  <p className="text-[#CDB586] font-medium">CEO — iPhone Hub Zimbabwe</p>
                  <div className="bg-[#EBE2C5] border border-[#CDB586]/30 rounded-lg p-4">
                    <p className="text-sm text-[#5F3C18] italic leading-relaxed">
                      Driving innovation and customer satisfaction at iPhone Hub Zimbabwe, ensuring every customer finds their perfect iPhone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
