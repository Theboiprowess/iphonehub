"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { CtaGroup } from "@/components/ui/cta-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { Loader2, Upload, CheckCircle, Clock, AlertCircle, Smartphone } from "lucide-react";

function EcoCashProofContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [error, setError] = useState('');
  
  const [transactionReference, setTransactionReference] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
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
          setSenderPhone(data.customerPhone);
        }
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Unable to load order details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('paymentId', payment?.id);
      formData.append('transactionReference', transactionReference);
      formData.append('amount', order?.total?.toString() || '0');
      formData.append('senderPhone', senderPhone);
      formData.append('paymentDate', paymentDate);
      
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }
      
      const response = await fetch('/api/payments/ecocash/proof', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to verification status page
        router.push(`/checkout/ecocash/verification?orderId=${orderId}`);
      } else {
        setError(data.error || 'Failed to submit proof');
      }
    } catch (error) {
      console.error('Proof submission error:', error);
      setError('Unable to submit proof. Please try again.');
    } finally {
      setSubmitting(false);
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
        <AlertCircle className="h-12 w-12 text-red-600" />
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
              Submit EcoCash Payment Proof
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
                  <div className="flex justify-between">
                    <span className="text-[#5F3C18]">Payment Status:</span>
                    <span className="font-medium">
                      {payment?.status === 'AWAITING_PROOF' && (
                        <span className="text-yellow-600">Awaiting Proof</span>
                      )}
                      {payment?.status === 'PROOF_SUBMITTED' && (
                        <span className="text-blue-600">Proof Submitted</span>
                      )}
                      {payment?.status === 'MATCHING' && (
                        <span className="text-purple-600">Verifying</span>
                      )}
                      {payment?.status === 'VERIFIED' && (
                        <span className="text-green-600">Verified</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-[#0E161B] p-4 rounded-lg text-white">
                <h3 className="font-semibold mb-3 text-[#EBE2C5]">EcoCash Payment Instructions</h3>
                <div className="space-y-2 text-sm text-[#EBE2C5]/80">
                  <p><strong>Amount:</strong> {formatPrice(Number(order.total))}</p>
                  <p><strong>Merchant:</strong> iPhone Hub Zimbabwe</p>
                  <p><strong>Order Reference:</strong> {order.orderNumber}</p>
                  <div className="mt-3 pt-3 border-t border-[#CDB586]/30">
                    <p className="font-medium text-[#EBE2C5]">Instructions:</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Open EcoCash on your phone</li>
                      <li>Make the payment to the merchant</li>
                      <li>Keep your EcoCash confirmation message</li>
                      <li>Return to this page</li>
                      <li>Submit your payment proof below</li>
                    </ol>
                  </div>
                </div>
              </div>

              {payment?.status === 'VERIFIED' ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Verified!</h3>
                  <p className="text-gray-600 mb-4">
                    Your payment has been successfully verified.
                  </p>
                  <CtaGroup>
                    <LinkButton
                      href={`/checkout/success?orderId=${orderId}`}
                      variant="primary"
                      goldGlow
                    >
                      View Order
                    </LinkButton>
                    <LinkButton
                      href="/thank-you"
                      variant="tertiary"
                    >
                      Thank You
                    </LinkButton>
                  </CtaGroup>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="transactionReference">EcoCash Transaction Reference *</Label>
                    <Input
                      id="transactionReference"
                      type="text"
                      placeholder="EC123456789"
                      value={transactionReference}
                      onChange={(e) => setTransactionReference(e.target.value)}
                      required
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the reference number from your EcoCash confirmation message
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="senderPhone">Your Phone Number *</Label>
                    <Input
                      id="senderPhone"
                      type="tel"
                      placeholder="077 XXX XXXX"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentDate">Payment Date *</Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="screenshot">Screenshot (Optional)</Label>
                    <div className="mt-1">
                      <Input
                        id="screenshot"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                      />
                      {previewUrl && (
                        <div className="mt-2">
                          <img
                            src={previewUrl}
                            alt="Payment proof"
                            className="max-w-full h-48 object-cover rounded border"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a screenshot of your EcoCash confirmation message (optional)
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    variant="primary"
                    goldGlow
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Payment Proof'
                    )}
                  </Button>

                  <div className="text-center text-xs text-gray-500">
                    <p>Your payment will be verified against our merchant records</p>
                  </div>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EcoCashProofPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-600" /></div>}>
      <EcoCashProofContent />
    </Suspense>
  );
}
