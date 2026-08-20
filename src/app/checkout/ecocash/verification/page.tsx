"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/button";
import { CtaGroup } from "@/components/ui/cta-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Loader2, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";

function EcoCashVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [polling, setPolling] = useState(false);
  
  useEffect(() => {
    if (orderId) {
      fetchPaymentStatus();
      
      // Poll for status updates every 5 seconds
      const interval = setInterval(() => {
        fetchPaymentStatus();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [orderId]);
  
  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payments/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setPayment(data);
        setOrder(data.order);
        
        // Stop polling if payment is verified
        if (data.status === 'VERIFIED' || data.status === 'APPROVED') {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusInfo = () => {
    if (!payment) return null;
    
    switch (payment.status) {
      case 'AWAITING_PROOF':
        return {
          icon: <Clock className="h-12 w-12 text-yellow-600" />,
          title: 'Awaiting Payment Proof',
          description: 'Please submit your EcoCash payment proof to continue',
          color: 'yellow',
        };
      case 'PROOF_SUBMITTED':
        return {
          icon: <Clock className="h-12 w-12 text-blue-600" />,
          title: 'Proof Submitted',
          description: 'Your payment proof has been submitted. We are verifying your EcoCash transaction.',
          color: 'blue',
        };
      case 'MATCHING':
        return {
          icon: <RefreshCw className="h-12 w-12 text-purple-600 animate-spin" />,
          title: 'Verifying Payment',
          description: 'We are matching your payment proof with our merchant records.',
          color: 'purple',
        };
      case 'VERIFIED':
      case 'APPROVED':
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-600" />,
          title: 'Payment Verified!',
          description: 'Your payment has been successfully verified and your order is being processed.',
          color: 'green',
        };
      case 'MISMATCH':
        return {
          icon: <AlertCircle className="h-12 w-12 text-red-600" />,
          title: 'Payment Requires Review',
          description: 'Your payment information does not match our records. Our team will review this manually.',
          color: 'red',
        };
      case 'MANUAL_REVIEW':
        return {
          icon: <AlertCircle className="h-12 w-12 text-orange-600" />,
          title: 'Manual Review Required',
          description: 'Your payment requires manual review. Our team will contact you shortly.',
          color: 'orange',
        };
      case 'REJECTED':
        return {
          icon: <AlertCircle className="h-12 w-12 text-red-600" />,
          title: 'Payment Rejected',
          description: 'Your payment could not be verified. Please contact customer support.',
          color: 'red',
        };
      default:
        return {
          icon: <Clock className="h-12 w-12 text-gray-600" />,
          title: 'Payment Pending',
          description: 'Your payment is being processed.',
          color: 'gray',
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  if (loading && !payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="site-container max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Payment Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Status Display */}
              <div className="text-center py-8">
                {statusInfo?.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2" style={{ color: statusInfo?.color === 'green' ? '#16a34a' : statusInfo?.color === 'red' ? '#dc2626' : statusInfo?.color === 'yellow' ? '#ca8a04' : statusInfo?.color === 'blue' ? '#2563eb' : statusInfo?.color === 'purple' ? '#9333ea' : statusInfo?.color === 'orange' ? '#ea580c' : '#4b5563' }}>
                  {statusInfo?.title}
                </h3>
                <p className="text-gray-600">{statusInfo?.description}</p>
              </div>

              {/* Order Summary */}
              {order && (
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
              )}

              {/* Proof Details */}
              {payment?.proofs && payment.proofs.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-900">Proof Submitted</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Transaction Reference:</span>
                      <span className="font-medium">{payment.proofs[0].transactionReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Submitted:</span>
                      <span className="font-medium">
                        {new Date(payment.proofs[0].submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transaction Matched */}
              {payment?.ecoCashTransaction && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-2 text-green-900">Transaction Matched</h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-medium">{payment.ecoCashTransaction.transactionReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">{formatPrice(Number(payment.ecoCashTransaction.amount))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sender:</span>
                      <span className="font-medium">{payment.ecoCashTransaction.senderPhone}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <CtaGroup>
                {payment?.status === 'AWAITING_PROOF' && (
                  <LinkButton
                    href={`/checkout/ecocash/proof?orderId=${orderId}`}
                    variant="primary"
                    goldGlow
                    className="flex-1"
                  >
                    Submit Proof
                  </LinkButton>
                )}
                
                {(payment?.status === 'VERIFIED' || payment?.status === 'APPROVED') && (
                  <>
                    <LinkButton
                      href={`/checkout/success?orderId=${orderId}`}
                      variant="primary"
                      goldGlow
                      className="flex-1"
                    >
                      View Order
                    </LinkButton>
                    <LinkButton
                      href="/thank-you"
                      variant="tertiary"
                      className="flex-1"
                    >
                      Thank You
                    </LinkButton>
                  </>
                )}
                
                {(payment?.status === 'MISMATCH' || payment?.status === 'MANUAL_REVIEW' || payment?.status === 'REJECTED') && (
                  <>
                    <LinkButton
                      href="/contact"
                      variant="secondary"
                      className="flex-1"
                    >
                      Contact Support
                    </LinkButton>
                    <LinkButton
                      href="/thank-you"
                      variant="tertiary"
                      className="flex-1"
                    >
                      Thank You
                    </LinkButton>
                  </>
                )}
                
                <LinkButton
                  href={`/order/${orderId}`}
                  variant="tertiary"
                  className="flex-1"
                >
                  View Order Details
                </LinkButton>
              </CtaGroup>

              {/* Refresh Button */}
              {payment?.status === 'PROOF_SUBMITTED' || payment?.status === 'MATCHING' ? (
                <div className="text-center">
                  <Button
                    onClick={fetchPaymentStatus}
                    disabled={polling}
                    variant="ghost"
                    size="sm"
                  >
                    {polling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Status
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Status updates automatically every 5 seconds
                  </p>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EcoCashVerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-600" /></div>}>
      <EcoCashVerificationContent />
    </Suspense>
  );
}
