"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Heart, Smartphone, CircleCheck, AlertTriangle, CircleX, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCatalogue() {
      try {
        const response = await fetch('/admin/api/catalogue');
        const data = await response.json();
        
        // Randomly select 3 items from the catalogue
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        
        // Transform to match expected format - manual upload only
        const transformed = selected.map((item: any, index: number) => {
          const imageUrl = item.imageUrl || item.image || null;
          return {
            id: item.id || index.toString(),
            name: item.title,
            model: item.model,
            storage: item.storage,
            colour: item.colour || "Various Colors",
            condition: item.condition || "SECOND_HAND",
            batteryHealth: item.batteryHealth || (85 + Math.floor(Math.random() * 15)),
            price: item.price,
            comparePrice: item.comparePrice || Math.round(item.price * 1.2),
            stock: item.stock || Math.floor(Math.random() * 5) + 1,
            imageUrl: imageUrl, // Manual upload only - no fallback
          };
        });
        
        setFeaturedProducts(transformed);
      } catch (error) {
        console.error('Failed to fetch catalogue:', error);
        // Fall back to localStorage
        const localData = localStorage.getItem('catalogueData');
        if (localData) {
          const data = JSON.parse(localData);
          const shuffled = [...data].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 3);
          
          const transformed = selected.map((item: any, index: number) => {
            const imageUrl = item.imageUrl || item.image || null;
            return {
              id: item.id || index.toString(),
              name: item.title,
              model: item.model,
              storage: item.storage,
              colour: item.colour || "Various Colors",
              condition: item.condition || "SECOND_HAND",
              batteryHealth: item.batteryHealth || (85 + Math.floor(Math.random() * 15)),
              price: item.price,
              comparePrice: item.comparePrice || Math.round(item.price * 1.2),
              stock: item.stock || Math.floor(Math.random() * 5) + 1,
              imageUrl: imageUrl, // Manual upload only - no fallback
            };
          });
          
          setFeaturedProducts(transformed);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogue();
  }, []);

  const conditionLabels: Record<string, { label: string; variant: "boxed" | "preOwned" | "secondHand" }> = {
    BOXED: { label: "Boxed / Brand New", variant: "boxed" },
    PRE_OWNED: { label: "Premium Pre-Owned", variant: "preOwned" },
    SECOND_HAND: { label: "Second-Hand", variant: "secondHand" },
  };

  const getStockIcon = (stock: number) => {
    if (stock > 0) return <CircleCheck className="h-4 w-4 text-[#CDB586]" />;
    if (stock === 0) return <CircleX className="h-4 w-4 text-[#5F3C18]" />;
    return <AlertTriangle className="h-4 w-4 text-[#9C7746]" />;
  };

  const getStockText = (stock: number) => {
    if (stock > 0) return `${stock} in stock`;
    if (stock === 0) return "Sold out";
    return "Low stock";
  };

  if (loading) {
    return (
      <section className="section-spacing bg-[#F7F5EF]">
        <div className="site-container">
          <SectionHeader 
            title="Featured iPhones"
            subtitle="Our most popular devices right now"
            className="text-center"
          />
          <div className="flex justify-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin text-[#CAA45A]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-spacing bg-[#F7F5EF]">
      <div className="site-container">
        <SectionHeader 
          title="Featured iPhones"
          subtitle="Our most popular devices right now"
          className="text-center"
        >
          <div className="flex justify-center mt-6">
            <Link href="/catalogue">
              <Button variant="outline" className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B] font-semibold h-11">
                View Price Catalogue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-w-0">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all bg-[#F7F5EF] border-[#CDB586] overflow-hidden flex flex-col h-full min-w-0">
              <CardHeader className="p-0 border-b border-[#CDB586]/20">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#EBE2C5] to-[#F7F5EF] flex items-center justify-center relative">
                  {/* Product Image */}
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      loading="lazy"
                    />
                  ) : (
                    /* Fallback placeholder */
                    <div className="relative w-full h-full flex items-center justify-center p-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#81592B]/5 to-[#5F3C18]/5"></div>
                      <div className="relative z-10 text-center">
                        <Smartphone className="h-16 w-16 mx-auto mb-3 text-[#CDB586]/40" />
                        <p className="text-xs text-[#5F3C18]/60">Image coming soon</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant={conditionLabels[product.condition].variant} className="text-xs">
                      {conditionLabels[product.condition].label}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-[#F7F5EF]/90 hover:bg-[#F7F5EF] text-[#5F3C18] backdrop-blur-sm h-9 w-9"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5 flex-1" style={{ paddingLeft: '2.5rem' }}>
                <div className="space-y-3">
                  <h3 className="font-semibold text-base text-[#0E161B] leading-tight">{product.name}</h3>
                  <div className="h-px w-10 bg-[#CDB586]/30"></div>
                </div>
                <div className="space-y-3 text-sm text-[#5F3C18]">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Model:</span>
                    <span>{product.model}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Storage:</span>
                    <span>{product.storage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Colour:</span>
                    <span>{product.colour}</span>
                  </div>
                  {product.condition !== "BOXED" && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Battery:</span>
                      <span>{product.batteryHealth}%</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-[#CDB586]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#0E161B]">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-[#81592B] line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-3">
                    {getStockIcon(product.stock)}
                    <span className="text-[#5F3C18]">{getStockText(product.stock)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-5 flex gap-3" style={{ paddingLeft: '2.5rem' }}>
                <Link href="/catalogue" className="flex-1">
                  <Button className="w-full bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814] text-sm h-11">
                    View Details
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B] h-11 w-11 p-0"
                  onClick={() => {
                    const whatsappNumber = "263773227172";
                    const message = `Hello iPhone Hub Zimbabwe, I am interested in the ${product.name} (${product.storage}). Is it still available?`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
