"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Edit, 
  Eye, 
  EyeOff, 
  Archive, 
  Loader2,
  Smartphone,
  Package,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id;
      if (id) {
        setProductId(id);
        fetchProduct(id);
      }
    };
    loadParams();
  }, [params]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/admin/api/products/${id}`);
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

  const handleStatusChange = async (action: string) => {
    if (!productId) return;
    try {
      const response = await fetch(`/admin/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });

      if (response.ok) {
        fetchProduct(productId);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#EBE2C5]/60">Product not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800 border-gray-200";
      case "PUBLISHED": return "bg-green-100 text-green-800 border-green-200";
      case "HIDDEN": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OUT_OF_STOCK": return "bg-red-100 text-red-800 border-red-200";
      case "SOLD": return "bg-purple-100 text-purple-800 border-purple-200";
      case "ARCHIVED": return "bg-gray-200 text-gray-600 border-gray-300";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "BOXED": return "bg-[#CDB586] text-[#0E161B] border border-[#0E161B]";
      case "PRE_OWNED": return "bg-[#81592B] text-[#EBE2C5] border border-[#EBE2C5]";
      case "SECOND_HAND": return "bg-[#5F3C18] text-[#EBE2C5] border border-[#EBE2C5]";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">{product.name}</h1>
            <p className="text-[#EBE2C5]/60">{product.model}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {productId && (
            <Link href={`/admin/products/${productId}/edit`}>
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
                <Badge className={getConditionBadge(product.condition)}>
                  {product.condition}
                </Badge>
                {product.isFeatured && (
                  <Badge className="bg-[#CDB586] text-[#0E161B] border border-[#0E161B]">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div>
                <p className="text-sm text-[#5F3C18]/60">Description</p>
                <p className="text-[#0E161B]">{product.description || "No description"}</p>
              </div>

              {product.category && (
                <div>
                  <p className="text-sm text-[#5F3C18]/60">Category</p>
                  <p className="text-[#0E161B]">{product.category.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Variants</CardTitle>
            </CardHeader>
            <CardContent>
              {product.variants && product.variants.length > 0 ? (
                <div className="space-y-3">
                  {product.variants.map((variant: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-[#CDB586] rounded">
                      <div>
                        <p className="font-medium text-[#0E161B]">{variant.storage} - {variant.colour}</p>
                        <p className="text-sm text-[#5F3C18]/60">
                          ${variant.price} {variant.comparePrice && `(was $${variant.comparePrice})`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#5F3C18]/60">Stock: {variant.stock}</p>
                        <p className="text-sm text-[#5F3C18]/60">Reserved: {variant.reserved}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#5F3C18]/60">No variants</p>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image: any, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded border border-[#CDB586]"
                      />
                      <Badge className="absolute top-2 right-2 bg-[#0E161B]/80 text-[#EBE2C5]">
                        {image.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 text-[#CDB586]/40" />
                  <p className="text-[#5F3C18]/60">No images uploaded</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Devices (for pre-owned/second-hand) */}
          {product.condition !== "BOXED" && product.devices && product.devices.length > 0 && (
            <Card className="bg-[#F7F5EF] border-[#CDB586]">
              <CardHeader>
                <CardTitle className="text-[#0E161B]">Individual Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.devices.map((device: any, index: number) => (
                    <div key={index} className="p-3 bg-white border border-[#CDB586] rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-[#0E161B]">Device {index + 1}</p>
                          {device.imei && <p className="text-sm text-[#5F3C18]/60">IMEI: {device.imei}</p>}
                          {device.serialNumber && <p className="text-sm text-[#5F3C18]/60">Serial: {device.serialNumber}</p>}
                        </div>
                        <div className="text-right">
                          {device.batteryHealth && (
                            <Badge className="bg-[#CDB586] text-[#0E161B]">
                              Battery: {device.batteryHealth}%
                            </Badge>
                          )}
                          {device.isSold && (
                            <Badge className="bg-red-600 text-white">Sold</Badge>
                          )}
                          {device.isReserved && (
                            <Badge className="bg-yellow-600 text-white">Reserved</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Status Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {product.status === "DRAFT" && (
                <Button
                  onClick={() => productId && handleStatusChange("PUBLISH")}
                  className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              )}
              {product.status === "PUBLISHED" && (
                <Button
                  onClick={() => productId && handleStatusChange("HIDE")}
                  variant="outline"
                  className="w-full border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide
                </Button>
              )}
              {product.status !== "ARCHIVED" && (
                <Button
                  onClick={() => productId && handleStatusChange("ARCHIVE")}
                  variant="outline"
                  className="w-full border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-[#F7F5EF] border-[#CDB586]">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5F3C18]">Total Stock</span>
                <span className="font-semibold text-[#0E161B]">
                  {product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5F3C18]">Total Reserved</span>
                <span className="font-semibold text-[#0E161B]">
                  {product.variants?.reduce((sum: number, v: any) => sum + (v.reserved || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5F3C18]">Price Range</span>
                <span className="font-semibold text-[#0E161B]">
                  ${Math.min(...product.variants?.map((v: any) => Number(v.price)) || 0)} - ${Math.max(...product.variants?.map((v: any) => Number(v.price)) || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}