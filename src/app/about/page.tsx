"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ScanSearch, Layers3, Headphones, Package, BadgeCheck, Smartphone, Phone, User } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section with iPhone Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0E161B] font-manrope">
              Your Trusted iPhone Hub in Masvingo
            </h1>
            <p className="text-lg sm:text-xl text-[#5F3C18] leading-relaxed">
              iPhone Hub Masvingo is a dedicated iPhone retail destination serving customers in Masvingo and beyond. We offer a range of boxed, pre-owned and second-hand iPhones, giving customers different options based on their preferences and budget.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#5F3C18]/20 to-[#81592B]/20 flex items-center justify-center border border-[#CDB586]/30 gold-glow overflow-hidden">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-[#81592B]/10 to-[#5F3C18]/10"></div>
                <div className="relative z-10 text-center p-8">
                  <Smartphone className="h-32 w-32 mx-auto mb-4 text-[#CDB586] gold-glow" />
                  <p className="text-[#EBE2C5] font-medium text-lg">iPhone Hub Store</p>
                  <p className="text-sm text-[#EBE2C5]/70 mt-2">Upload store image</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B] font-manrope">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#5F3C18] text-lg leading-relaxed">
                Our mission is to make quality iPhones more accessible while giving customers a professional, transparent and convenient buying experience.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What We Offer - Fixed Icons */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#0E161B] font-manrope">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#0E161B] border-[#CDB586]">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#CDB586] text-[#0E161B] flex items-center justify-center mb-4">
                  <Package className="h-6 w-6" />
                </div>
                <CardTitle className="text-[#EBE2C5]">BOXED iPHONES</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#EBE2C5]/80">
                  For customers looking for boxed devices and a premium new-device experience.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#81592B] to-[#5F3C18] border-[#EBE2C5]">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#CDB586] text-[#0E161B] flex items-center justify-center mb-4">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-[#EBE2C5]">PRE-OWNED iPHONES</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#EBE2C5]/80">
                  Carefully selected devices for customers who want quality and value at a more accessible price.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#5F3C18] border-[#CDB586]">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#CDB586] text-[#0E161B] flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6" />
                </div>
                <CardTitle className="text-[#EBE2C5]">SECOND-HAND iPHONES</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#EBE2C5]/80">
                  Affordable iPhone options for customers working within different budgets.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Approach - Fixed Icons */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-[#0E161B] font-manrope">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-[#0E161B]">QUALITY</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#5F3C18]">
                  We aim to provide customers with quality devices and clear information about the condition of each phone.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <ScanSearch className="h-6 w-6" />
                </div>
                <CardTitle className="text-[#0E161B]">TRANSPARENCY</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#5F3C18]">
                  Customers should be able to understand what they are buying, including model, storage, condition and other relevant device information.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <Layers3 className="h-6 w-6" />
                </div>
                <CardTitle className="text-[#0E161B]">CHOICE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#5F3C18]">
                  Different customers have different needs and budgets, which is why iPhone Hub offers boxed, pre-owned and second-hand options.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-[#0E161B] text-[#CDB586] flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6" />
                </div>
                <CardTitle className="text-[#0E161B]">CUSTOMER SERVICE</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#5F3C18]">
                  Our team is available to help customers choose a device that suits their needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CEO Section */}
        <div className="mb-16">
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Meet Our CEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-48 h-48 bg-gradient-to-br from-[#81592B] to-[#5F3C18] rounded-2xl flex items-center justify-center flex-shrink-0 border-2 border-[#CDB586] gold-glow overflow-hidden">
                  <div className="text-center p-6">
                    <User className="h-16 w-16 mx-auto mb-2 text-[#CDB586]" />
                    <p className="text-xs text-[#EBE2C5]/70">CEO Photo</p>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2 text-[#0E161B]">Artwell Gwata</h3>
                  <p className="text-[#5F3C18] mb-4 text-lg">CEO — iPhone Hub Masvingo</p>
                  <div className="bg-[#EBE2C5] border border-[#CDB586] rounded-lg p-4">
                    <p className="text-sm text-[#5F3C18] italic">
                      [CEO Biography - Editable field in admin panel]
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-[#0E161B] wood-texture rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4 text-[#EBE2C5] font-manrope">
            Ready to Find Your Next iPhone?
          </h2>
          <p className="text-lg text-[#EBE2C5]/80 mb-8 max-w-2xl mx-auto">
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
                const message = "Hello iPhone Hub Masvingo, I would like to enquire about your iPhones.";
                window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              CHAT ON WHATSAPP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
