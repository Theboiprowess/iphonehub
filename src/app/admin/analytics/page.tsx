"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  AlertTriangle,
  Clock,
  ChevronRight
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { formatPrice } from "@/lib/utils";

type AnalyticsData = {
  overview: {
    totalProducts: number;
    totalOrders: number;
    totalCustomers: number;
    totalRevenue: number;
    pendingEnquiries: number;
    pendingTradeIns: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
      name: string;
      email: string;
    };
  }>;
  topProducts: Array<{
    productName: string;
    quantity: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    availableStock: number;
    variant: {
      product: {
        name: string;
      };
    };
  }>;
  period: string;
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState("30");

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/admin/api/analytics?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Analytics" subtitle="View business analytics" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Analytics" subtitle="View business analytics" />
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Analytics" subtitle="View business analytics">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </AdminPageHeader>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]/60">Total Revenue</p>
                <p className="text-2xl font-bold text-[#0E161B]">{formatPrice(data.overview.totalRevenue)}</p>
                <p className="text-xs text-[#5F3C18]/60">Last {period} days</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]/60">Total Orders</p>
                <p className="text-2xl font-bold text-[#0E161B]">{data.overview.totalOrders}</p>
                <p className="text-xs text-[#5F3C18]/60">Last {period} days</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]/60">Total Customers</p>
                <p className="text-2xl font-bold text-[#0E161B]">{data.overview.totalCustomers}</p>
                <p className="text-xs text-[#5F3C18]/60">All time</p>
              </div>
              <Users className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]/60">Published Products</p>
                <p className="text-2xl font-bold text-[#0E161B]">{data.overview.totalProducts}</p>
                <p className="text-xs text-[#5F3C18]/60">Active listings</p>
              </div>
              <Package className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]/60">Pending Enquiries</p>
                <p className="text-2xl font-bold text-[#0E161B]">{data.overview.pendingEnquiries}</p>
                <p className="text-xs text-[#5F3C18]/60">Awaiting response</p>
              </div>
              <Clock className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]/60">New Trade-Ins</p>
                <p className="text-2xl font-bold text-[#0E161B]">{data.overview.pendingTradeIns}</p>
                <p className="text-xs text-[#5F3C18]/60">Awaiting review</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProducts.length === 0 ? (
              <div className="text-center py-8 text-[#5F3C18]/60">
                No sales data yet
              </div>
            ) : (
              <div className="space-y-3">
                {data.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between bg-[#F7F5EF]/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-[#CDB586] rounded-full text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-[#0E161B]">{product.productName}</div>
                        <div className="text-sm text-[#5F3C18]/60">{product.quantity} sold</div>
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-[#CDB586]" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {data.lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-[#5F3C18]/60">
                All products well stocked
              </div>
            ) : (
              <div className="space-y-3">
                {data.lowStockProducts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-[#F7F5EF]/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium text-[#0E161B]">{item.variant.product.name}</div>
                        <div className="text-sm text-[#5F3C18]/60">{item.availableStock} in stock</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="/admin/inventory">
                        View <ChevronRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-[#5F3C18]/60">
              No recent orders
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Order</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Total</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Status</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{order.orderNumber}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">{order.user.name}</div>
                        <div className="text-sm text-[#5F3C18]/60">{order.user.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-[#0E161B]">{formatPrice(order.total)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">{order.status}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
