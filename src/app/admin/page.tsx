"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Package, ShoppingBag, DollarSign, Users, ArrowRight, AlertTriangle, MessageSquare, TrendingUp, Activity, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    // In production, this would fetch real KPI data from API routes
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Dashboard</h1>
        <p className="text-[#EBE2C5]/60">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Total Products</CardTitle>
            <Smartphone className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{kpiData.totalProducts}</div>
            <p className="text-xs text-[#5F3C18]">{kpiData.activeProducts} active • {kpiData.outOfStockProducts} out of stock</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{kpiData.totalOrders}</div>
            <p className="text-xs text-[#5F3C18]">{kpiData.pendingOrders} pending • {kpiData.completedOrders} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">
              ${kpiData.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-[#5F3C18]">From {kpiData.completedOrders} paid orders</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Customers</CardTitle>
            <Users className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{kpiData.totalCustomers}</div>
            <p className="text-xs text-[#5F3C18]">Registered customers</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Trade-In Requests</CardTitle>
            <ArrowRight className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{kpiData.tradeInRequests}</div>
            <p className="text-xs text-[#5F3C18]">{kpiData.newTradeIns} new requests</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Enquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{kpiData.enquiries}</div>
            <p className="text-xs text-[#5F3C18]">{kpiData.newEnquiries} pending response</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Pending Reviews</CardTitle>
            <Activity className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{kpiData.pendingReviews}</div>
            <p className="text-xs text-[#5F3C18]">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#5F3C18]">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#CDB586]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#0E161B]">{kpiData.lowStockProducts.length}</div>
            <p className="text-xs text-[#5F3C18]">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/(protected)/products/new">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">Add New Product</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/(protected)/orders">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">View Orders ({kpiData.pendingOrders} pending)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/(protected)/trade-in">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <ArrowRight className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">Trade-Ins ({kpiData.newTradeIns} new)</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/(protected)/enquiries">
          <Card className="bg-[#0E161B] border-[#CDB586]/30 hover:border-[#CDB586] transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-[#CDB586]" />
                <span className="text-[#EBE2C5] font-medium">Enquiries ({kpiData.newEnquiries} new)</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0E161B]">Recent Orders</CardTitle>
              <Link href="/admin/(protected)/orders" className="text-sm text-[#5F3C18] hover:text-[#CDB586]">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {kpiData.recentOrders.length === 0 ? (
              <div className="text-center py-8 text-[#5F3C18]">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
                <p className="font-medium">No orders yet</p>
                <p className="text-sm">Orders will appear here when customers make purchases</p>
              </div>
            ) : (
              <div className="space-y-4">
                {kpiData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-[#EBE2C5] rounded-lg">
                    <div>
                      <p className="font-medium text-[#0E161B]">{order.orderNumber}</p>
                      <p className="text-sm text-[#5F3C18]">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#0E161B]">${(order.total || 0).toLocaleString()}</p>
                      <p className="text-sm text-[#5F3C18]">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0E161B]">Recent Customers</CardTitle>
              <Link href="/admin/(protected)/customers" className="text-sm text-[#5F3C18] hover:text-[#CDB586]">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {kpiData.recentCustomers.length === 0 ? (
              <div className="text-center py-8 text-[#5F3C18]">
                <Users className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
                <p className="font-medium">No customers yet</p>
                <p className="text-sm">Customer registrations will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {kpiData.recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-[#EBE2C5] rounded-lg">
                    <div>
                      <p className="font-medium text-[#0E161B]">{customer.name || customer.email}</p>
                      <p className="text-sm text-[#5F3C18]">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <Clock className="h-4 w-4 text-[#5F3C18] mx-auto mb-1" />
                      <p className="text-xs text-[#5F3C18]">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      {kpiData.lowStockProducts.length > 0 && (
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0E161B]">Low Stock Alert</CardTitle>
              <Link href="/admin/(protected)/inventory" className="text-sm text-[#5F3C18] hover:text-[#CDB586]">
                Manage inventory
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpiData.lowStockProducts.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-[#EBE2C5] rounded-lg">
                  <div>
                    <p className="font-medium text-[#0E161B]">{item.product.name}</p>
                    <p className="text-sm text-[#5F3C18]">{item.storage} • {item.colour}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#0E161B]">{item.stock} units</p>
                    <p className="text-sm text-[#5F3C18]">Low stock</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}