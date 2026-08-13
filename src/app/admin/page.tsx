"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Package, ShoppingBag, DollarSign, Users, ArrowRight, AlertTriangle, MessageSquare, TrendingUp, Activity, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

export default function AdminDashboardPage() {
  const [kpiData, setKpiData] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    tradeInRequests: 0,
    newTradeIns: 0,
    enquiries: 0,
    newEnquiries: 0,
    pendingReviews: 0,
    lowStockProducts: [] as any[],
    recentOrders: [] as any[],
    recentCustomers: [] as any[],
    pendingPaymentVerification: 0,
    verifiedPayments: 0,
    rejectedPayments: 0,
    manualReviewPayments: 0,
    todayEcoCashPayments: 0,
    totalVerifiedRevenue: 0,
    unmatchedSmsTransactions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real KPI data from API with error handling
    const fetchDashboardData = async () => {
      try {
        console.log("Fetching dashboard data...");
        const response = await fetch('/admin/api/dashboard');
        console.log("Dashboard response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard data received:", data);
          setKpiData(data);
          setError(null);
        } else {
          console.error("Dashboard API error:", response.status, response.statusText);
          setError(`API Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError("Network error. Using default data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#5F3C18]">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <AdminPageContainer>
      <div className="space-y-8">
        <AdminPageHeader 
          title="Dashboard"
          subtitle="Welcome back! Here's what's happening with your business."
        />

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 min-w-0">
        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Total Products</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.totalProducts}</div>
            <p className="text-xs text-[#5F3C18] mt-2">{kpiData.activeProducts} active • {kpiData.outOfStockProducts} out of stock</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Total Orders</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.totalOrders}</div>
            <p className="text-xs text-[#5F3C18] mt-2">{kpiData.pendingOrders} pending • {kpiData.completedOrders} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Revenue</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">
              ${kpiData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#5F3C18] mt-2">From {kpiData.completedOrders} paid orders</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Customers</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.totalCustomers}</div>
            <p className="text-xs text-[#5F3C18] mt-2">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Trade-In Requests</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.tradeInRequests}</div>
            <p className="text-xs text-[#5F3C18] mt-2">{kpiData.newTradeIns} new requests</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Enquiries</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.enquiries}</div>
            <p className="text-xs text-[#5F3C18] mt-2">{kpiData.newEnquiries} pending response</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Pending Reviews</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.pendingReviews}</div>
            <p className="text-xs text-[#5F3C18] mt-2">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Low Stock Alert</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.lowStockProducts.length}</div>
            <p className="text-xs text-[#5F3C18] mt-2">Items need restocking</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Payment Verification</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.pendingPaymentVerification}</div>
            <p className="text-xs text-[#5F3C18] mt-2">{kpiData.manualReviewPayments} need review</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Verified Payments</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.verifiedPayments}</div>
            <p className="text-xs text-[#5F3C18] mt-2">${kpiData.totalVerifiedRevenue.toLocaleString()} verified</p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 hover:shadow-md transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Today's EcoCash</CardTitle>
            <div className="h-10 w-10 rounded-lg bg-[#CDB586]/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-[#CDB586]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#0E161B]">{kpiData.todayEcoCashPayments}</div>
            <p className="text-xs text-[#5F3C18] mt-2">{kpiData.unmatchedSmsTransactions} unmatched SMS</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/products/new">
          <Card className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-5 w-5 text-[#CDB586]" />
                </div>
                <span className="text-[#EBE2C5] font-medium text-sm">Add New Product</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
                </div>
                <span className="text-[#EBE2C5] font-medium text-sm">View Orders ({kpiData.pendingOrders} pending)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/trade-in">
          <Card className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-[#CDB586]" />
                </div>
                <span className="text-[#EBE2C5] font-medium text-sm">Trade-Ins ({kpiData.newTradeIns} new)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/enquiries">
          <Card className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-[#CDB586]" />
                </div>
                <span className="text-[#EBE2C5] font-medium text-sm">Enquiries ({kpiData.newEnquiries} pending)</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        {/* Recent Orders */}
        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-lg font-semibold text-[#0E161B]">Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-[#CDB586] hover:bg-[#CDB586]/10 font-medium">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {kpiData.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {kpiData.recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-[#F7F5EF]/50 rounded-lg border border-[#CDB586]/10">
                    <div>
                      <p className="text-sm font-semibold text-[#0E161B]">Order #{order.id?.slice(0, 8)}</p>
                      <p className="text-xs text-[#5F3C18] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#CDB586]">${order.total?.toFixed(2)}</p>
                      <p className="text-xs text-[#5F3C18] mt-1">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-12 w-12 rounded-full bg-[#CDB586]/10 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="h-6 w-6 text-[#CDB586]" />
                </div>
                <p className="text-sm text-[#5F3C18]">No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-5">
            <CardTitle className="text-lg font-semibold text-[#0E161B]">Recent Customers</CardTitle>
            <Link href="/admin/customers">
              <Button variant="ghost" size="sm" className="text-[#CDB586] hover:bg-[#CDB586]/10 font-medium">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {kpiData.recentCustomers.length > 0 ? (
              <div className="space-y-3">
                {kpiData.recentCustomers.slice(0, 5).map((customer: any) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-[#F7F5EF]/50 rounded-lg border border-[#CDB586]/10">
                    <div>
                      <p className="text-sm font-semibold text-[#0E161B]">{customer.name || customer.email}</p>
                      <p className="text-xs text-[#5F3C18] mt-1">{customer.email}</p>
                    </div>
                    <p className="text-xs text-[#5F3C18]">{new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-12 w-12 rounded-full bg-[#CDB586]/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-[#CDB586]" />
                </div>
                <p className="text-sm text-[#5F3C18]">No recent customers</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminPageContainer>
  );
}