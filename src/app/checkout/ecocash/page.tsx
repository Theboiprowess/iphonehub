"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Loader2, Smartphone, ArrowRight } from "lucide-react";

function EcoCashPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);
  
  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        
        // Fetch payment details
        const paymentResponse = await fetch(`/api/payments/${orderId}`);
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          setPayment(paymentData);
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Unable to load order details');
    } finally {
      setLoading(false);
    }
  };
  
  const initiatePayment = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/payments/ecocash/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          customerPhone: order.customerPhone,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Redirect to proof submission page
        router.push(`/checkout/ecocash/proof?orderId=${orderId}`);
      } else {
        setError(data.message || data.error || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      setError('Unable to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="site-container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-[#CDB586]" />
              Pay with EcoCash
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-[#F7F5EF] p-4 rounded-lg border border-[#CDB586]/30">
                <h3 className="font-semibold mb-2 text-[#0E161B]">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#5F3C18]">Order:</span>
                    <span className="font-medium text-[#0E161B]">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5F3C18]">Total:</span>
                    <span className="font-bold text-lg text-[#0E161B]">{formatPrice(Number(order.total))}</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-[#0E161B] p-6 rounded-lg text-white">
                <h3 className="font-semibold mb-4 text-[#EBE2C5]">EcoCash Payment Instructions</h3>
                <div className="space-y-3 text-sm text-[#EBE2C5]/80">
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-semibold text-[#EBE2C5]">{formatPrice(Number(order.total))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Merchant:</span>
                    <span className="font-semibold text-[#EBE2C5]">iPhone Hub Zimbabwe</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Reference:</span>
                    <span className="font-semibold text-[#EBE2C5]">{order.orderNumber}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#CDB586]/30">
                  <p className="font-medium text-[#EBE2C5] mb-3">Instructions:</p>
                  <ol className="list-decimal list-inside space-y-2 text-[#EBE2C5]/90">
                    <li>Open EcoCash on your phone</li>
                    <li>Make the payment to iPhone Hub Zimbabwe</li>
                    <li>Keep your EcoCash confirmation message</li>
                    <li>Click the button below when you've made the payment</li>
                    <li>Submit your payment proof on the next page</li>
                  </ol>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                onClick={initiatePayment}
                disabled={loading}
                className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    I've Made the Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="text-center text-xs text-gray-500">
                <p>Your payment will be verified against our merchant records</p>
                <p className="mt-1">Do not submit payment until you have actually paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EcoCashPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-600" /></div>}>
      <EcoCashPaymentContent />
    </Suspense>
  );
}
