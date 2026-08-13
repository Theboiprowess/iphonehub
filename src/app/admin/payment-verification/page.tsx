"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Search,
  Filter
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { formatPrice } from "@/lib/utils";

type PaymentVerification = {
  id: string;
  orderNumber: string;
  paymentReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  amount: number;
  receivingAccountName: string;
  receivingAccountNumber: string;
  status: string;
  hasProof: boolean;
  hasSms: boolean;
  proofTransactionRef?: string;
  smsTransactionRef?: string;
  createdAt: string;
  matchResult?: {
    amountMatch: boolean;
    accountMatch: boolean;
    phoneMatch: boolean;
    referenceMatch: boolean;
    errors: string[];
  };
};

export default function PaymentVerificationPage() {
  const [payments, setPayments] = useState<PaymentVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentVerification | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/payment-verification?${params}`);
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data.payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter, searchQuery]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      AWAITING_PROOF: "bg-yellow-100 text-yellow-800",
      PROOF_SUBMITTED: "bg-blue-100 text-blue-800",
      MATCHING: "bg-purple-100 text-purple-800",
      VERIFIED: "bg-green-100 text-green-800",
      MISMATCH: "bg-red-100 text-red-800",
      MANUAL_REVIEW: "bg-orange-100 text-orange-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="h-4 w-4" />;
      case "MISMATCH":
      case "REJECTED":
        return <XCircle className="h-4 w-4" />;
      case "MANUAL_REVIEW":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <AdminPageContainer>
      <div className="space-y-8">
        <AdminPageHeader 
          title="Payment Verification" 
          subtitle="Review and verify EcoCash payments"
        />

        {/* Filters */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]/50" />
                  <input
                    placeholder="Search by order, customer, or reference..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#CDB586]/30 rounded-lg bg-white"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-[#CDB586]/30 rounded-lg bg-white"
              >
                <option value="">All Statuses</option>
                <option value="AWAITING_PROOF">Awaiting Proof</option>
                <option value="PROOF_SUBMITTED">Proof Submitted</option>
                <option value="MATCHING">Matching</option>
                <option value="VERIFIED">Verified</option>
                <option value="MISMATCH">Mismatch</option>
                <option value="MANUAL_REVIEW">Manual Review</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle>Payment Verification Queue ({payments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-[#5F3C18]/60">Loading...</div>
            ) : payments.length === 0 ? (
              <div className="text-center py-12 text-[#5F3C18]/60">
                <Clock className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
                <p>No payments in verification queue</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#CDB586]/20">
                      <th className="text-left p-4 font-semibold text-[#0E161B]">Order</th>
                      <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                      <th className="text-left p-4 font-semibold text-[#0E161B]">Amount</th>
                      <th className="text-left p-4 font-semibold text-[#0E161B]">Account</th>
                      <th className="text-left p-4 font-semibold text-[#0E161B]">Evidence</th>
                      <th className="text-left p-4 font-semibold text-[#0E161B]">Status</th>
                      <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                        <td className="p-4">
                          <div className="font-medium text-[#0E161B]">{payment.orderNumber}</div>
                          <div className="text-sm text-[#5F3C18]/60">{payment.paymentReference}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-[#0E161B]">{payment.customerName}</div>
                          <div className="text-sm text-[#5F3C18]/60">{payment.customerPhone}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#0E161B]">{formatPrice(payment.amount)}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-[#0E161B]">{payment.receivingAccountName}</div>
                          <div className="text-sm text-[#5F3C18]/60">{payment.receivingAccountNumber}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {payment.hasProof && (
                              <Badge variant="outline" className="text-xs">
                                Proof
                              </Badge>
                            )}
                            {payment.hasSms && (
                              <Badge variant="outline" className="text-xs">
                                SMS
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusBadge(payment.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(payment.status)}
                              <span>{payment.status.replace(/_/g, " ")}</span>
                            </div>
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Detail Dialog */}
        <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payment Verification Details</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="bg-[#F7F5EF] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Order #:</strong> {selectedPayment.orderNumber}</div>
                    <div><strong>Payment Reference:</strong> {selectedPayment.paymentReference}</div>
                    <div><strong>Customer:</strong> {selectedPayment.customerName}</div>
                    <div><strong>Phone:</strong> {selectedPayment.customerPhone}</div>
                    <div><strong>Email:</strong> {selectedPayment.customerEmail}</div>
                    <div><strong>Amount:</strong> {formatPrice(selectedPayment.amount)}</div>
                  </div>
                </div>

                {/* Receiving Account */}
                <div className="bg-[#F7F5EF] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">EcoCash Account</h4>
                  <div className="text-sm">
                    <div><strong>Name:</strong> {selectedPayment.receivingAccountName}</div>
                    <div><strong>Number:</strong> {selectedPayment.receivingAccountNumber}</div>
                  </div>
                </div>

                {/* Evidence */}
                <div className="bg-[#F7F5EF] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Evidence</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {selectedPayment.hasProof ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Customer Proof Submitted</span>
                      {selectedPayment.proofTransactionRef && (
                        <span className="text-[#5F3C18]/60">({selectedPayment.proofTransactionRef})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPayment.hasSms ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span>Merchant SMS Received</span>
                      {selectedPayment.smsTransactionRef && (
                        <span className="text-[#5F3C18]/60">({selectedPayment.smsTransactionRef})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Result */}
                {selectedPayment.matchResult && (
                  <div className="bg-[#F7F5EF] p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Match Verification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        {selectedPayment.matchResult.amountMatch ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Amount Match</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPayment.matchResult.accountMatch ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Account Match</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPayment.matchResult.phoneMatch ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Phone Match</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedPayment.matchResult.referenceMatch ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span>Reference Match</span>
                      </div>
                      {selectedPayment.matchResult.errors.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 rounded text-red-800">
                          <strong>Errors:</strong> {selectedPayment.matchResult.errors.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedPayment(null)}>
                    Close
                  </Button>
                  {selectedPayment.status === "MANUAL_REVIEW" && (
                    <>
                      <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        Reject
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        Approve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageContainer>
  );
}
