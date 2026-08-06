"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatPrice } from "@/lib/utils";
import { Heart, Phone, ShoppingCart, Share2, Shield, Truck, Clock } from "lucide-react";

const conditionLabels: Record<string, { label: string; variant: "boxed" | "preOwned" | "secondHand" }> = {
  BOXED: { label: "Boxed / Brand New", variant: "boxed" },
  PRE_OWNED: { label: "Premium Pre-Owned", variant: "preOwned" },
  SECOND_HAND: { label: "Second-Hand", variant: "secondHand" },
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${params.id}`);
      const data = await response.json();
      setProduct(data);
      if (data.variants?.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppEnquiry = () => {
    const message = `Hello iPhone Hub Masvingo, I am interested in the ${product?.name} ${selectedVariant?.storage} ${selectedVariant?.colour}. Is it still available?`;
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "263000000000";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Product not found</p>
      </div>
    );
  }

  const allImages = [...product.images, ...(selectedVariant?.images || [])];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span className="mx-2">/</span>
          <a href="/iphones" className="hover:text-gray-900">iPhones</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              {allImages.length > 0 && allImages[selectedImage] ? (
                <img
                  src={allImages[selectedImage].url as string}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-6xl">📱</div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-black" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.url as string}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant={conditionLabels[product.condition].variant} className="mb-4">
                {conditionLabels[product.condition].label}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600">{product.model}</p>
            </div>

            {selectedVariant && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">
                    {formatPrice(selectedVariant.price)}
                  </span>
                  {selectedVariant.comparePrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(selectedVariant.comparePrice)}
                    </span>
                  )}
                </div>

                {/* Variant Selection */}
                {product.variants.length > 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Storage</label>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant: any) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-4 py-2 rounded-lg border-2 ${
                              selectedVariant.id === variant.id
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {variant.storage}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Colour</label>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(new Set(product.variants.map((v: any) => v.colour))).map((colour: any) => (
                          <button
                            key={colour}
                            onClick={() => {
                              const variant = product.variants.find((v: any) => v.colour === colour);
                              if (variant) setSelectedVariant(variant);
                            }}
                            className={`px-4 py-2 rounded-lg border-2 ${
                              selectedVariant.colour === colour
                                ? "border-black bg-black text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {colour}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Device Details */}
                {selectedVariant.batteryHealth && (
                  <div className="space-y-2 text-sm">
                    <p><strong>Battery Health:</strong> {selectedVariant.batteryHealth}%</p>
                    <p><strong>Availability:</strong> {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : "Out of stock"}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full" disabled={!selectedVariant || selectedVariant.stock === 0}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="whatsapp" size="lg" className="w-full" onClick={handleWhatsAppEnquiry}>
                <Phone className="mr-2 h-5 w-5" />
                Enquire on WhatsApp
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Quality Checked</p>
              </div>
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs text-gray-600">Warranty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="includes">What's Included</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600">{product.description || "No description available."}</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Model:</strong> {product.model}</p>
                  {selectedVariant && (
                    <>
                      <p><strong>Storage:</strong> {selectedVariant.storage}</p>
                      <p><strong>Colour:</strong> {selectedVariant.colour}</p>
                      {selectedVariant.batteryHealth && (
                        <p><strong>Battery Health:</strong> {selectedVariant.batteryHealth}%</p>
                      )}
                    </>
                  )}
                  <p><strong>Condition:</strong> {conditionLabels[product.condition].label}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="includes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>iPhone Device</li>
                  <li>Charging Cable</li>
                  <li>Original Box (if boxed)</li>
                  <li>Documentation</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review: any) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                            ))}
                          </div>
                          <span className="font-medium">{review.name}</span>
                        </div>
                        {review.title && <p className="font-medium mb-1">{review.title}</p>}
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Why Buy From iPhone Hub */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Why Buy From iPhone Hub Masvingo?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-1 text-gray-600" />
                <div>
                  <h4 className="font-medium mb-1">Authentic Devices</h4>
                  <p className="text-sm text-gray-600">All devices are verified for authenticity.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 mt-1 text-gray-600" />
                <div>
                  <h4 className="font-medium mb-1">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">Quick delivery across Masvingo and Zimbabwe.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-1 text-gray-600" />
                <div>
                  <h4 className="font-medium mb-1">Warranty Support</h4>
                  <p className="text-sm text-gray-600">Peace of mind with our warranty coverage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 text-gray-600" />
                <div>
                  <h4 className="font-medium mb-1">Expert Support</h4>
                  <p className="text-sm text-gray-600">Professional assistance when you need it.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}