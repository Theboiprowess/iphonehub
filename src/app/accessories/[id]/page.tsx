"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, ShoppingCart, Share2, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

const conditionLabels: Record<string, { label: string; variant: "boxed" | "preOwned" | "secondHand" }> = {
  BOXED: { label: "Boxed / Brand New", variant: "boxed" },
  PRE_OWNED: { label: "Premium Pre-Owned", variant: "preOwned" },
  SECOND_HAND: { label: "Second-Hand", variant: "secondHand" },
};

export default function AccessoryDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
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

  const mainImage = product.images?.[selectedImage] || null;
  const stock = product.variants?.[0]?.stock || 0;
  const price = product.variants?.[0]?.price || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="site-container py-8">
        {/* Breadcrumb */}
        <Link href="/accessories" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accessories
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-6xl">🎧</div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-[#CDB586]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant={conditionLabels[product.condition].variant} className="mb-2">
                {conditionLabels[product.condition].label}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.model}</p>
            </div>

            <div className="text-3xl font-bold text-gray-900">
              {formatPrice(price)}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span>In Stock ({stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-1" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose max-w-none">
                <p>{product.description}</p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Available Options</h3>
                <div className="space-y-2">
                  {product.variants.map((variant: any) => (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{variant.storage}</span>
                        {variant.colour && <span className="text-gray-600 ml-2">• {variant.colour}</span>}
                      </div>
                      <div className="font-semibold">
                        {formatPrice(Number(variant.price))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Device Information */}
            {product.devices && product.devices.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Device Information</h3>
                <div className="space-y-2">
                  {product.devices.map((device: any) => (
                    <div key={device.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {device.imei && <div><span className="text-gray-600">IMEI:</span> {device.imei}</div>}
                        {device.serialNumber && <div><span className="text-gray-600">Serial:</span> {device.serialNumber}</div>}
                        {device.batteryHealth && <div><span className="text-gray-600">Battery:</span> {device.batteryHealth}%</div>}
                        {device.icloudStatus && <div><span className="text-gray-600">iCloud:</span> {device.icloudStatus}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                  onClick={() => {
                    const whatsappNumber = "263773227172"; // Artwell's WhatsApp (Zimbabwe format)
                    const message = encodeURIComponent(
                      `Hi Artwell, I'm interested in buying:\n\n` +
                      `Product: ${product.name}\n` +
                      `Model: ${product.model}\n` +
                      `Condition: ${product.condition}\n` +
                      `Price: ${formatPrice(price)}\n\n` +
                      `I'd like to discuss purchasing this item.`
                    );
                    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Contact Artwell
                </Button>
                <Button 
                  className="flex-1 bg-[#25D366] text-white hover:bg-[#128C7E]"
                  onClick={() => {
                    const whatsappNumber = "263784502347"; // Sabeka's WhatsApp (Zimbabwe format)
                    const message = encodeURIComponent(
                      `Hi Sabeka, I'm interested in buying:\n\n` +
                      `Product: ${product.name}\n` +
                      `Model: ${product.model}\n` +
                      `Condition: ${product.condition}\n` +
                      `Price: ${formatPrice(price)}\n\n` +
                      `I'd like to discuss purchasing this item.`
                    );
                    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Sabeka
                </Button>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Click to contact via WhatsApp for purchase negotiation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}