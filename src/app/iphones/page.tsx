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
import { getIPhoneImageUrl } from "@/lib/iphone-image-provider";
import { Heart, Search, SlidersHorizontal, MessageSquare } from "lucide-react";
import Link from "next/link";
import { CEOSelectionDialog } from "@/components/whatsapp/ceo-selection-dialog";

const conditionLabels: Record<string, { label: string; variant: "boxed" | "preOwned" | "secondHand" }> = {
  BOXED: { label: "Boxed / Brand New", variant: "boxed" },
  PRE_OWNED: { label: "Premium Pre-Owned", variant: "preOwned" },
  SECOND_HAND: { label: "Second-Hand", variant: "secondHand" },
};

export default function iPhonesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const [filters, setFilters] = useState({
    condition: "",
    model: "",
    minPrice: "",
    maxPrice: "",
    storage: "",
    sortBy: "featured",
    search: "",
  });

  useEffect(() => {
    // Check URL params on mount
    const urlParams = new URLSearchParams(window.location.search);
    const conditionParam = urlParams.get("condition");
    if (conditionParam) {
      setFilters((prev) => ({ ...prev, condition: conditionParam }));
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

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
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setProducts(data);
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

  const clearFilters = () => {
    setFilters({
      condition: "",
      model: "",
      minPrice: "",
      maxPrice: "",
      storage: "",
      sortBy: "featured",
      search: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 section-spacing">
      <div className="site-container">
        <SectionHeader 
          title={filters.condition === "boxed" ? "Boxed iPhones" : filters.condition === "pre-owned" ? "Pre-Owned iPhones" : filters.condition === "second-hand" ? "Second-Hand iPhones" : "iPhones"}
          subtitle={filters.condition === "boxed" ? "Browse our collection of brand new boxed iPhones" : 
             filters.condition === "pre-owned" ? "Browse our collection of premium pre-owned iPhones" :
             filters.condition === "second-hand" ? "Browse our collection of second-hand iPhones" :
             "Browse our collection of quality iPhones"}
        />

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search iPhones..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="pl-11 pr-6 h-11"
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
            {filters.condition && (
              <Button
                variant="tertiary"
                onClick={clearFilters}
              >
                Clear Filter
              </Button>
            )}
          </div>

          <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 min-w-0">
              <Select
                value={filters.condition}
                onValueChange={(value) => updateFilter("condition", value)}
              >
                <SelectTrigger className="h-11 px-6" style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
                  <SelectItem value="boxed">Boxed / Brand New</SelectItem>
                  <SelectItem value="pre-owned">Pre-Owned</SelectItem>
                  <SelectItem value="preowned">Pre-Owned</SelectItem>
                  <SelectItem value="second-hand">Second-Hand</SelectItem>
                  <SelectItem value="secondhand">Second-Hand</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Model (e.g., iPhone 15)"
                value={filters.model}
                onChange={(e) => updateFilter("model", e.target.value)}
                className="px-6 h-11"
                style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}
              />

              <Select
                value={filters.storage}
                onValueChange={(value) => updateFilter("storage", value)}
              >
                <SelectTrigger className="h-11 px-6" style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}>
                  <SelectValue placeholder="Storage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Storage</SelectItem>
                  <SelectItem value="64GB">64GB</SelectItem>
                  <SelectItem value="128GB">128GB</SelectItem>
                  <SelectItem value="256GB">256GB</SelectItem>
                  <SelectItem value="512GB">512GB</SelectItem>
                  <SelectItem value="1TB">1TB</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input
                  placeholder="Min Price"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="px-6 h-11"
                  style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}
                />
                <Input
                  placeholder="Max Price"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="px-6 h-11"
                  style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}
                />
              </div>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilter("sortBy", value)}
              >
                <SelectTrigger className="h-11 px-6" style={{ paddingLeft: '1.5rem !important', paddingRight: '1.5rem !important' }}>
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
            <p className="text-gray-600 text-lg mb-4">
              {filters.condition === "boxed" 
                ? "No boxed iPhones available at the moment" 
                : filters.condition === "pre-owned" 
                ? "No pre-owned iPhones available at the moment" 
                : filters.condition === "second-hand" 
                ? "No second-hand iPhones available at the moment" 
                : "No iPhones available at the moment"}
            </p>
            {filters.condition && (
              <Button
                variant="tertiary"
                onClick={clearFilters}
              >
                View All iPhones
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-w-0">
            {products.map((product) => {
              const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
              return (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow min-w-0">
                  <CardHeader className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                      {(() => {
                        const imageUrl = (product.images && product.images.length > 0 && product.images[0] && product.images[0].url) || null;
                        return imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                            loading="lazy"
                          />
                        ) : (
                          <div className="text-6xl">📱</div>
                        );
                      })()}
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
                    <h3 className="font-semibold text-lg text-gray-900 leading-tight iphone-product-name">{product.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600 iphone-product-details">
                      <p className="font-medium">{product.model}</p>
                      {variant ? (
                        <>
                          <p>{variant.storage} • {variant.colour}</p>
                          {product.condition !== "BOXED" && (
                            <p>Battery Health: {variant.batteryHealth}%</p>
                          )}
                        </>
                      ) : (
                        <p>No variants available</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-2 iphone-product-price">
                      <span className="text-2xl font-bold text-gray-900">
                        {variant && variant.price
                          ? formatPrice(variant.price)
                          : 'Contact for price'}
                        </span>
                      {variant && variant.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(variant.comparePrice)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm iphone-product-stock">
                      {variant ? (
                        <>
                          {variant.stock > 0 ? (
                            <span className="text-green-600">
                              Available
                            </span>
                          ) : (
                            <span className="text-red-600">
                              Sold out
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-600">
                          Coming soon
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 iphone-card-footer">
                    <CtaGroup>
                      <LinkButton href={`/iphones/${product.id}`} className="flex-1">
                        View Details
                      </LinkButton>
                      <Button
                        variant="whatsapp"
                        className="w-11 p-0"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowWhatsAppDialog(true);
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </CtaGroup>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* WhatsApp CEO Selection Dialog */}
        <CEOSelectionDialog
          open={showWhatsAppDialog}
          onOpenChange={setShowWhatsAppDialog}
          productName={selectedProduct?.name}
          productVariant={selectedProduct?.variants?.[0] ? `${selectedProduct.variants[0].storage} • ${selectedProduct.variants[0].colour}` : undefined}
          price={selectedProduct?.variants?.[0] ? formatPrice(selectedProduct.variants[0].price) : undefined}
          context="product"
        />
      </div>
    </div>
  );
}
