"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, ShoppingCart, Share2, CheckCircle, XCircle, MessageSquare, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { CEOSelectionDialog } from "@/components/whatsapp/ceo-selection-dialog";

const conditionLabels: Record<string, { label: string; variant: "boxed" | "preOwned" | "secondHand" }> = {
  BOXED: { label: "Boxed / Brand New", variant: "boxed" },
  PRE_OWNED: { label: "Premium Pre-Owned", variant: "preOwned" },
  SECOND_HAND: { label: "Second-Hand", variant: "secondHand" },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

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
        // Set first variant as default if available
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
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
  const stock = selectedVariant?.stock || 0;
  const price = selectedVariant?.price || 0;

  const handleAddToCart = () => {
    if (!selectedVariant || stock <= 0) return;

    addItem({
      id: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      model: product.model,
      storage: selectedVariant.storage,
      colour: selectedVariant.colour,
      price: Number(selectedVariant.price),
      comparePrice: selectedVariant.comparePrice ? Number(selectedVariant.comparePrice) : undefined,
      image: mainImage?.url,
      condition: product.condition,
    });
  };

  const handleBuyNow = () => {
    if (!selectedVariant || stock <= 0) return;

    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <div className="site-container py-12 sm:py-16 lg:py-20">
        {/* Breadcrumb */}
        <Link href="/iphones" className="inline-flex items-center text-[#5F3C18] hover:text-[#0E161B] mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to iPhones
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-[#CDB586]/30 shadow-lg">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EBE2C5] to-[#F7F5EF]">
                  <div className="text-center">
                    <div className="h-32 w-32 mx-auto mb-4 rounded-full bg-[#CDB586]/20 flex items-center justify-center">
                      <ShoppingCart className="h-16 w-16 text-[#CDB586]/50" />
                    </div>
                    <p className="text-[#5F3C18]">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#CDB586] shadow-lg' : 'border-gray-200 hover:border-[#CDB586]/50'
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
          <div className="space-y-8">
            <div>
              <Badge variant={conditionLabels[product.condition].variant} className="mb-3">
                {conditionLabels[product.condition].label}
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0E161B] mb-2 font-manrope">{product.name}</h1>
              <p className="text-lg text-[#5F3C18]">{product.model}</p>
            </div>

            <div className="text-4xl font-bold text-[#0E161B]">
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
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock <= 0}
                      className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-[#CDB586] bg-[#CDB586]/10'
                          : 'border-gray-200 hover:border-[#CDB586]/50'
                      } ${variant.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="text-left">
                        <span className="font-medium text-[#0E161B]">{variant.storage}</span>
                        {variant.colour && <span className="text-[#5F3C18] ml-2">• {variant.colour}</span>}
                        {variant.stock <= 0 && <span className="text-red-600 ml-2 text-sm">(Out of Stock)</span>}
                      </div>
                      <div className="font-semibold text-[#0E161B]">
                        {formatPrice(Number(variant.price))}
                      </div>
                    </button>
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
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  className="flex-1 h-12 bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1A20]"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || stock <= 0 || addingToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  className="flex-1 h-12 bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                  onClick={handleBuyNow}
                  disabled={!selectedVariant || stock <= 0}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>

              <Button
                className="w-full h-12 bg-[#25D366] text-white hover:bg-[#128C7E]"
                onClick={() => setShowWhatsAppDialog(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat on WhatsApp
              </Button>

              {stock <= 0 && (
                <p className="text-sm text-red-600 text-center font-medium">
                  This item is currently out of stock
                </p>
              )}
            </div>

            {/* WhatsApp CEO Selection Dialog */}
            <CEOSelectionDialog
              open={showWhatsAppDialog}
              onOpenChange={setShowWhatsAppDialog}
              productName={product.name}
              productVariant={selectedVariant ? `${selectedVariant.storage} • ${selectedVariant.colour}` : undefined}
              price={formatPrice(price)}
              context="product"
              onBuyOnline={handleBuyNow}
            />
          </div>
        </div>
      </div>
    </div>
  );
}