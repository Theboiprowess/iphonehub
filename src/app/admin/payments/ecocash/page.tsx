"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Loader2, Smartphone, CheckCircle, Clock, AlertCircle, Search, Filter } from "lucide-react";

export default function EcoCashPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    verified: 0,
    manualReview: 0,
    mismatched: 0,
  });
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    fetchPayments();
  }, []);
  
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/payments/ecocash');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
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
  
  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = search === '' || 
      payment.order?.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      payment.customerPhone?.includes(search) ||
      payment.proofs?.[0]?.transactionReference?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">EcoCash Payments</h1>
          <p className="text-[#EBE2C5]/60">Manage EcoCash payment verification</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Manual Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.manualReview}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Mismatched</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.mismatched}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#0E161B] border-[#CDB586]/30">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order, phone, or reference..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0E161B] border border-[#CDB586]/30 rounded-md text-[#EBE2C5] placeholder-gray-500 focus:outline-none focus:border-[#CDB586]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-[#CDB586] text-[#0E161B]' : 'border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10'}
              >
                All
              </Button>
              <Button
                variant={filter === 'AWAITING_PROOF' ? 'default' : 'outline'}
                onClick={() => setFilter('AWAITING_PROOF')}
                className={filter === 'AWAITING_PROOF' ? 'bg-[#CDB586] text-[#0E161B]' : 'border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10'}
              >
                Pending
              </Button>
              <Button
                variant={filter === 'VERIFIED' ? 'default' : 'outline'}
                onClick={() => setFilter('VERIFIED')}
                className={filter === 'VERIFIED' ? 'bg-[#CDB586] text-[#0E161B]' : 'border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10'}
              >
                Verified
              </Button>
              <Button
                variant={filter === 'MANUAL_REVIEW' ? 'default' : 'outline'}
                onClick={() => setFilter('MANUAL_REVIEW')}
                className={filter === 'MANUAL_REVIEW' ? 'bg-[#CDB586] text-[#0E161B]' : 'border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10'}
              >
                Review
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="bg-[#0E161B] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle className="text-[#EBE2C5]">Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#CDB586]/30">
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">Order</th>
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">Customer</th>
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">Reference</th>
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">SMS Match</th>
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-[#EBE2C5]/80 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-[#EBE2C5]/60">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-[#CDB586]/20 hover:bg-[#CDB586]/5">
                      <td className="py-3 px-4 text-[#EBE2C5]">{payment.order?.orderNumber}</td>
                      <td className="py-3 px-4 text-[#EBE2C5]">{payment.customerPhone}</td>
                      <td className="py-3 px-4 text-[#EBE2C5] font-medium">{formatPrice(Number(payment.amount))}</td>
                      <td className="py-3 px-4 text-[#EBE2C5]">
                        {payment.proofs?.[0]?.transactionReference || '-'}
                      </td>
                      <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                      <td className="py-3 px-4">
                        {payment.ecoCashTransaction ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-[#EBE2C5]/60 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.location.href = `/admin/payments/ecocash/${payment.id}`}
                          className="text-[#CDB586] hover:text-[#EBE2C5]"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
