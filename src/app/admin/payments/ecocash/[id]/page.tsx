"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/utils";
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock, ArrowLeft, Smartphone, FileText, Image as ImageIcon } from "lucide-react";

export default function EcoCashPaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.id;
  
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    }
  }, [paymentId]);
  
  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/payments/ecocash/${paymentId}`);
      if (response.ok) {
        const data = await response.json();
        setPayment(data);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleManualApprove = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/payments/ecocash/${paymentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      
      if (response.ok) {
        await fetchPaymentDetails();
        setNotes('');
      } else {
        alert('Failed to approve payment');
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Failed to approve payment');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleManualReject = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/payments/ecocash/${paymentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      
      if (response.ok) {
        await fetchPaymentDetails();
        setNotes('');
      } else {
        alert('Failed to reject payment');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment');
    } finally {
      setActionLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AWAITING_PROOF':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Awaiting Proof</Badge>;
      case 'PROOF_SUBMITTED':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Proof Submitted</Badge>;
      case 'MATCHING':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Matching</Badge>;
      case 'VERIFIED':
      case 'APPROVED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case 'MISMATCH':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Mismatch</Badge>;
      case 'MANUAL_REVIEW':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Manual Review</Badge>;
      case 'REJECTED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }
  
  if (!payment) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <p className="text-gray-600">Payment not found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-[#CDB586] hover:text-[#EBE2C5]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Payment Details</h1>
          <p className="text-[#EBE2C5]/60">Review EcoCash payment verification</p>
        </div>
      </div>

      {/* Order Information */}
      <Card className="bg-[#0E161B] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle className="text-[#EBE2C5] flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-[#EBE2C5]/60 text-sm">Order Number</p>
              <p className="text-[#EBE2C5] font-medium">{payment.order?.orderNumber}</p>
            </div>
            <div>
              <p className="text-[#EBE2C5]/60 text-sm">Customer</p>
              <p className="text-[#EBE2C5] font-medium">{payment.order?.customerName}</p>
            </div>
            <div>
              <p className="text-[#EBE2C5]/60 text-sm">Customer Email</p>
              <p className="text-[#EBE2C5] font-medium">{payment.order?.customerEmail}</p>
            </div>
            <div>
              <p className="text-[#EBE2C5]/60 text-sm">Customer Phone</p>
              <p className="text-[#EBE2C5] font-medium">{payment.customerPhone}</p>
            </div>
            <div>
              <p className="text-[#EBE2C5]/60 text-sm">Total Amount</p>
              <p className="text-[#EBE2C5] font-bold text-lg">{formatPrice(Number(payment.amount))}</p>
            </div>
            <div>
              <p className="text-[#EBE2C5]/60 text-sm">Payment Status</p>
              <div className="mt-1">{getStatusBadge(payment.status)}</div>
            </div>
            <div>
              <p className="text-[#EBE2C5]/60 text-sm">Created</p>
              <p className="text-[#EBE2C5]">{new Date(payment.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Proof */}
      {payment.proofs && payment.proofs.length > 0 && (
        <Card className="bg-[#0E161B] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle className="text-[#EBE2C5] flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Customer Proof Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Transaction Reference</p>
                <p className="text-[#EBE2C5] font-medium">{payment.proofs[0].transactionReference}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Amount Submitted</p>
                <p className="text-[#EBE2C5] font-medium">{formatPrice(Number(payment.proofs[0].amount))}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Sender Phone</p>
                <p className="text-[#EBE2C5] font-medium">{payment.proofs[0].senderPhone}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Payment Date</p>
                <p className="text-[#EBE2C5]">{new Date(payment.proofs[0].paymentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Submitted At</p>
                <p className="text-[#EBE2C5]">{new Date(payment.proofs[0].submittedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Proof Status</p>
                <div className="mt-1">{getStatusBadge(payment.proofs[0].status)}</div>
              </div>
            </div>
            
            {payment.proofs[0].screenshotUrl && (
              <div className="mt-4">
                <p className="text-[#EBE2C5]/60 text-sm mb-2">Screenshot</p>
                <div className="bg-[#CDB586]/10 p-4 rounded border border-[#CDB586]/30">
                  <div className="flex items-center gap-2 text-[#EBE2C5]/80">
                    <ImageIcon className="h-5 w-5" />
                    <span>{payment.proofs[0].screenshotUrl}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Merchant Transaction */}
      {payment.ecoCashTransaction && (
        <Card className="bg-[#0E161B] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle className="text-[#EBE2C5] flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Merchant EcoCash Transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Transaction Reference</p>
                <p className="text-[#EBE2C5] font-medium">{payment.ecoCashTransaction.transactionReference}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Amount</p>
                <p className="text-[#EBE2C5] font-medium">{formatPrice(Number(payment.ecoCashTransaction.amount))}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Sender Phone</p>
                <p className="text-[#EBE2C5] font-medium">{payment.ecoCashTransaction.senderPhone}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Merchant Number</p>
                <p className="text-[#EBE2C5] font-medium">{payment.ecoCashTransaction.merchantNumber}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Merchant Name</p>
                <p className="text-[#EBE2C5] font-medium">{payment.ecoCashTransaction.merchantName}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Transaction Time</p>
                <p className="text-[#EBE2C5]">{payment.ecoCashTransaction.transactionTime}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Received At</p>
                <p className="text-[#EBE2C5]">{new Date(payment.ecoCashTransaction.receivedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[#EBE2C5]/60 text-sm">Transaction Status</p>
                <div className="mt-1">
                  {payment.ecoCashTransaction.status === 'MATCHED' ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Matched</Badge>
                  ) : payment.ecoCashTransaction.status === 'MISMATCH' ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Mismatch</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-[#EBE2C5]/60 text-sm mb-2">Raw SMS Message</p>
              <div className="bg-[#CDB586]/10 p-4 rounded border border-[#CDB586]/30">
                <p className="text-[#EBE2C5]/80 font-mono text-sm whitespace-pre-wrap">
                  {payment.ecoCashTransaction.rawMessage}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Result */}
      {payment.ecoCashTransaction && (
        <Card className="bg-[#0E161B] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle className="text-[#EBE2C5]">Match Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#EBE2C5]/80">Amount Match</span>
                {Math.abs(Number(payment.amount) - Number(payment.ecoCashTransaction.amount)) < 0.01 ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#EBE2C5]/80">Reference Match</span>
                {payment.proofs?.[0]?.transactionReference === payment.ecoCashTransaction.transactionReference ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#EBE2C5]/80">Phone Match</span>
                {payment.customerPhone === payment.ecoCashTransaction.senderPhone ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#EBE2C5]/80">Duplicate Check</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Review Actions */}
      {(payment.status === 'MISMATCH' || payment.status === 'MANUAL_REVIEW') && (
        <Card className="bg-[#0E161B] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle className="text-[#EBE2C5]">Manual Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-[#EBE2C5]/60 text-sm">Review Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes for this review decision..."
                  className="mt-1 bg-[#0E161B] border-[#CDB586]/30 text-[#EBE2C5]"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleManualApprove}
                  disabled={actionLoading}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Payment
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleManualReject}
                  disabled={actionLoading}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-600/10"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Payment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Log */}
      <Card className="bg-[#0E161B] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle className="text-[#EBE2C5]">Audit Log</CardTitle>
        </CardHeader>
        <CardContent>
          {payment.auditLogs && payment.auditLogs.length > 0 ? (
            <div className="space-y-2">
              {payment.auditLogs.map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-[#CDB586]/5 rounded border border-[#CDB586]/20">
                  <Clock className="h-4 w-4 text-[#CDB586] mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[#EBE2C5] text-sm font-medium">{log.action}</p>
                    <p className="text-[#EBE2C5]/60 text-xs">
                      {new Date(log.timestamp).toLocaleString()} • {log.actorType}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#EBE2C5]/60 text-sm">No audit logs available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
