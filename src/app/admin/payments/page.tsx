"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye,
  Download
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  providerTransactionId: string | null;
  merchantReference: string | null;
  amount: number;
  currency: string;
  customerPhone: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  order: {
    customerName: string;
    customerEmail: string;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0,
  });

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/admin/payments");
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/payments/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customerPhone.includes(searchTerm) ||
      payment.order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "text-green-600 bg-green-50";
      case "PENDING":
      case "PROCESSING":
        return "text-yellow-600 bg-yellow-50";
      case "FAILED":
      case "CANCELLED":
      case "EXPIRED":
        return "text-red-600 bg-red-50";
      case "REFUNDED":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
      case "PROCESSING":
        return <Clock className="h-4 w-4" />;
      case "FAILED":
      case "CANCELLED":
      case "EXPIRED":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CDB586]"></div>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container">
        <AdminPageHeader title="Payments" subtitle="Manage and monitor all payment transactions" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#0E161B]">{stats.total}</div>
              <CreditCard className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#0E161B] border-[#CDB586]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#EBE2C5]">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#CDB586]">{formatPrice(stats.todayRevenue)}</div>
              <DollarSign className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0E161B] border-[#CDB586]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#EBE2C5]">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#CDB586]">{formatPrice(stats.weekRevenue)}</div>
              <TrendingUp className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0E161B] border-[#CDB586]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#EBE2C5]">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-[#CDB586]">{formatPrice(stats.monthRevenue)}</div>
              <DollarSign className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <CardTitle className="text-[#0E161B]">Payment Transactions</CardTitle>
            <Button variant="outline" size="sm" className="border-[#CDB586] text-[#0E161B] flex-shrink-0">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order, phone, or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-[#CDB586] rounded-md bg-white text-sm flex-shrink-0"
            >
              <option value="all">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#CDB586]/20">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#5F3C18]">Order</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#5F3C18]">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#5F3C18]">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#5F3C18]">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#5F3C18]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#5F3C18]">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#5F3C18]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#0E161B]">{payment.orderNumber}</div>
                        <div className="text-xs text-gray-500">{payment.providerTransactionId || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#5F3C18]">
                        {payment.order.customerName}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#5F3C18]">
                        {payment.customerPhone}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#0E161B]">
                          {formatPrice(payment.amount)}
                        </div>
                        <div className="text-xs text-gray-500">{payment.currency}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#5F3C18]">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" className="text-[#0E161B] hover:text-[#CDB586] flex-shrink-0">
                          <Eye className="h-4 w-4" />
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
    </AdminPageContainer>
  );
}
