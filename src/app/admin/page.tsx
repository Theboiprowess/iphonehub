"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Package, ShoppingBag, DollarSign, Users, ArrowRight, AlertTriangle, MessageSquare, TrendingUp, Activity, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

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
    <div className="space-y-8">
      <AdminPageHeader 
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your business."
      />

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 min-w-0">
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Total Products</CardTitle>
            <Smartphone className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">{kpiData.totalProducts}</div>
            <p className="text-xs text-[#5F3C18] mt-1">{kpiData.activeProducts} active • {kpiData.outOfStockProducts} out of stock</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Total Orders</CardTitle>
            <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">{kpiData.totalOrders}</div>
            <p className="text-xs text-[#5F3C18] mt-1">{kpiData.pendingOrders} pending • {kpiData.completedOrders} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">
              ${kpiData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#5F3C18] mt-1">From {kpiData.completedOrders} paid orders</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Customers</CardTitle>
            <Users className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">{kpiData.totalCustomers}</div>
            <p className="text-xs text-[#5F3C18] mt-1">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Trade-In Requests</CardTitle>
            <ArrowRight className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">{kpiData.tradeInRequests}</div>
            <p className="text-xs text-[#5F3C18] mt-1">{kpiData.newTradeIns} new requests</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Enquiries</CardTitle>
            <MessageSquare className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">{kpiData.enquiries}</div>
            <p className="text-xs text-[#5F3C18] mt-1">{kpiData.newEnquiries} pending response</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Pending Reviews</CardTitle>
            <Activity className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">{kpiData.pendingReviews}</div>
            <p className="text-xs text-[#5F3C18] mt-1">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-[#5F3C18]">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-5 w-5 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-[#0E161B]">{kpiData.lowStockProducts.length}</div>
            <p className="text-xs text-[#5F3C18] mt-1">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/products/new">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">Add New Product</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/(protected)/orders">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">View Orders ({kpiData.pendingOrders} pending)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/(protected)/trade-in">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">Trade-Ins ({kpiData.newTradeIns} new)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/(protected)/enquiries">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">Enquiries ({kpiData.newEnquiries} pending)</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        {/* Recent Orders */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-[#0E161B]">Recent Orders</CardTitle>
            <Link href="/admin/(protected)/orders">
              <Button variant="ghost" size="sm" className="text-[#CDB586] hover:bg-[#CDB586]/10">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {kpiData.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {kpiData.recentOrders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-[#0E161B]/5 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-[#0E161B]">Order #{order.id?.slice(0, 8)}</p>
                      <p className="text-xs text-[#5F3C18]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#CDB586]">${order.total?.toFixed(2)}</p>
                      <p className="text-xs text-[#5F3C18]">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#5F3C18] text-center py-4">No recent orders</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold text-[#0E161B]">Recent Customers</CardTitle>
            <Link href="/admin/(protected)/customers">
              <Button variant="ghost" size="sm" className="text-[#CDB586] hover:bg-[#CDB586]/10">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {kpiData.recentCustomers.length > 0 ? (
              <div className="space-y-3">
                {kpiData.recentCustomers.slice(0, 5).map((customer: any) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-[#0E161B]/5 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-[#0E161B]">{customer.name || customer.email}</p>
                      <p className="text-xs text-[#5F3C18]">{customer.email}</p>
                    </div>
                    <p className="text-xs text-[#5F3C18]">{new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#5F3C18] text-center py-4">No recent customers</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}