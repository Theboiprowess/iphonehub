"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button, LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CtaGroup } from "@/components/ui/cta-group";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPrice } from "@/lib/utils";
import { Heart, Search, SlidersHorizontal, MessageSquare } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const conditionLabels: Record<string, { label: string; variant: "boxed" | "preOwned" | "secondHand" }> = {
  BOXED: { label: "Boxed / Brand New", variant: "boxed" },
  PRE_OWNED: { label: "Premium Pre-Owned", variant: "preOwned" },
  SECOND_HAND: { label: "Second-Hand", variant: "secondHand" },
};

export default function AccessoriesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    condition: "",
    search: "",
    sortBy: "featured",
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      // Filter products by category (accessories)
      const accessoriesProducts = data.filter((product: any) => 
        product.category?.name?.toLowerCase().includes('accessory') || 
        product.categoryId === 'accessories'
      );
      
      if (Array.isArray(accessoriesProducts)) {
        setProducts(accessoriesProducts);
      } else {
        console.error("API returned non-array data:", data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 section-spacing">
      <div className="site-container">
        <SectionHeader 
          title="Accessories"
          subtitle="Browse our collection of iPhone accessories"
        />

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accessories..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-11 h-11"
                style={{ paddingLeft: '2.5rem !important', paddingRight: '1.5rem !important' }}
              />
            </div>
            <Button
              variant="tertiary"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0">
              <Select
                value={filters.condition}
                onValueChange={(value) => updateFilter("condition", value)}
              >
                <SelectTrigger className="h-11" style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
                  <SelectItem value="boxed">Boxed / Brand New</SelectItem>
                  <SelectItem value="pre-owned">Pre-Owned</SelectItem>
                  <SelectItem value="second-hand">Second-Hand</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilter("sortBy", value)}
              >
                <SelectTrigger className="h-11" style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No accessories found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-w-0">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow min-w-0">
                <CardHeader className="p-0">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    {product.images && product.images.length > 0 && product.images[0] && product.images[0].url ? (
                      <img 
                        src={product.images[0].url} 
                        alt={product.images[0].alt || product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-6xl">🎧</div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant={conditionLabels[product.condition].variant}>
                        {conditionLabels[product.condition].label}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/80 hover:bg-white h-9 w-9"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 leading-tight accessories-product-name">{product.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600 accessories-product-details">
                    <p>{product.model}</p>
                    {product.variants?.[0] && (
                      <>
                        <p>{product.variants[0].storage} • {product.variants[0].colour}</p>
                        {product.variants[0].batteryHealth && (
                          <p>Battery Health: {product.variants[0].batteryHealth}%</p>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-2 accessories-product-price">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.variants?.[0]?.price || 0)}
                    </span>
                    {product.variants?.[0]?.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.variants[0].comparePrice)}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 accessories-card-footer">
                  <CtaGroup>
                    <LinkButton href={`/accessories/${product.id}`} className="flex-1">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </LinkButton>
                    <Button 
                      variant="whatsapp" 
                      className="flex-1"
                      onClick={() => {
                        const whatsappNumber = "263773227172"; // Artwell's WhatsApp
                        const message = encodeURIComponent(
                          `Hi, I'm interested in: ${product.name} - ${product.model} (${formatPrice(product.variants?.[0]?.price || 0)})`
                        );
                        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Quick Contact
                    </Button>
                  </CtaGroup>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
