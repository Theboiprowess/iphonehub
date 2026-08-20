"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, LinkButton } from "@/components/ui/button";
import { CtaGroup } from "@/components/ui/cta-group";
import { CheckCircle, MessageCircle, ShoppingBag, Package, Truck, Phone, Mail } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CEOSelectionDialog } from "@/components/whatsapp/ceo-selection-dialog";

export default function CheckoutSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false);

  useEffect(() => {
    if (params.orderId) {
      fetchOrder(params.orderId as string);
    }
  }, [params.orderId]);

  const fetchOrder = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CDB586] mx-auto mb-4"></div>
          <p className="text-[#5F3C18]">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-[#5F3C18] mb-4">Order not found</p>
            <LinkButton href="/iphones">
              Continue Shopping
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-12">
      <div className="site-container">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#0E161B] mb-2">Payment Successful</h1>
            <p className="text-[#5F3C18]">Thank you for shopping with iPhone Hub Zimbabwe</p>
          </div>

          {/* Order Details Card */}
          <Card className="bg-white border-[#CDB586]/30 mb-6">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-[#CDB586]/20">
                <span className="text-[#5F3C18]">Order Number</span>
                <span className="font-semibold text-[#0E161B]">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[#CDB586]/20">
                <span className="text-[#5F3C18]">Payment Status</span>
                <span className="font-semibold text-green-600">PAID</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-[#CDB586]/20">
                <span className="text-[#5F3C18]">Total Amount</span>
                <span className="font-semibold text-[#0E161B] text-xl">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card className="bg-white border-[#CDB586]/30 mb-6">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b border-[#CDB586]/20 last:border-0">
                    <div>
                      <p className="font-medium text-[#0E161B]">{item.variant.product.name}</p>
                      <p className="text-sm text-[#5F3C18]">
                        {item.variant.storage} • {item.variant.colour} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-[#0E161B]">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Card */}
          <Card className="bg-white border-[#CDB586]/30 mb-6">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#CDB586]" />
                <div>
                  <p className="text-sm text-[#5F3C18]">Phone</p>
                  <p className="font-medium text-[#0E161B]">{order.customerPhone}</p>
                </div>
              </div>
              {order.customerWhatsapp && (
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-4 w-4 text-[#CDB586]" />
                  <div>
                    <p className="text-sm text-[#5F3C18]">WhatsApp</p>
                    <p className="font-medium text-[#0E161B]">{order.customerWhatsapp}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#CDB586]" />
                <div>
                  <p className="text-sm text-[#5F3C18]">Email</p>
                  <p className="font-medium text-[#0E161B]">{order.customerEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information Card */}
          <Card className="bg-white border-[#CDB586]/30 mb-6">
            <CardHeader>
              <CardTitle className="text-[#0E161B]">Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-[#CDB586]" />
                <div>
                  <p className="text-sm text-[#5F3C18]">Delivery Method</p>
                  <p className="font-medium text-[#0E161B] capitalize">{order.deliveryMethod}</p>
                </div>
              </div>
              {order.deliveryAddress && (
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-[#CDB586]" />
                  <div>
                    <p className="text-sm text-[#5F3C18]">Delivery Address</p>
                    <p className="font-medium text-[#0E161B]">{order.deliveryAddress}</p>
                  </div>
                </div>
              )}
              {order.city && (
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-[#CDB586]" />
                  <div>
                    <p className="text-sm text-[#5F3C18]">City</p>
                    <p className="font-medium text-[#0E161B]">{order.city}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <CtaGroup>
            <Button
              variant="whatsapp"
              className="w-full"
              onClick={() => setShowWhatsAppDialog(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Us on WhatsApp
            </Button>

            <LinkButton
              href="/thank-you"
              variant="primary"
              goldGlow
              className="w-full"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Thank You
            </LinkButton>

            <LinkButton
              href="/iphones"
              variant="tertiary"
              className="w-full"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </LinkButton>
          </CtaGroup>

          {/* WhatsApp CEO Selection Dialog */}
          <CEOSelectionDialog
            open={showWhatsAppDialog}
            onOpenChange={setShowWhatsAppDialog}
            orderNumber={order.orderNumber}
            context="order"
          />
        </div>
      </div>
    </div>
  );
}