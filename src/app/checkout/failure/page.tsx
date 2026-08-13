"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw, MessageCircle, ShoppingBag, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CEOSelectionDialog } from "@/components/whatsapp/ceo-selection-dialog";

export default function CheckoutFailurePage() {
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

  const handleRetryPayment = () => {
    if (order) {
      router.push(`/checkout/ecocash?orderId=${order.id}`);
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

  return (
    <div className="min-h-screen bg-[#F7F5EF] py-12">
      <div className="site-container">
        <div className="max-w-2xl mx-auto">
          {/* Failure Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-[#0E161B] mb-2">Payment Unsuccessful</h1>
            <p className="text-[#5F3C18]">Your payment could not be completed</p>
          </div>

          {/* Order Details Card */}
          {order && (
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
                  <span className="font-semibold text-red-600">FAILED</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#CDB586]/20">
                  <span className="text-[#5F3C18]">Total Amount</span>
                  <span className="font-semibold text-[#0E161B] text-xl">{formatPrice(order.total)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {order && (
              <Button
                className="w-full h-12 bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1A20] font-semibold"
                onClick={handleRetryPayment}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Payment Again
              </Button>
            )}

            <Button
              className="w-full h-12 bg-[#25D366] text-white hover:bg-[#128C7E] font-semibold"
              onClick={() => setShowWhatsAppDialog(true)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>

            <Button
              className="w-full h-12 bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
              variant="outline"
              onClick={() => router.push("/iphones")}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* WhatsApp CEO Selection Dialog */}
          <CEOSelectionDialog
            open={showWhatsAppDialog}
            onOpenChange={setShowWhatsAppDialog}
            orderNumber={order?.orderNumber}
            context="order"
          />
        </div>
      </div>
    </div>
  );
}