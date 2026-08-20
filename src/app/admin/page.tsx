"use client";

import { Button } from "@/components/ui/button";
import { Smartphone, Package, ShoppingBag, DollarSign, Users, ArrowRight, AlertTriangle, MessageSquare, TrendingUp, Activity, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { StatCard } from "@/components/admin/stat-card";
import { ResponsiveGrid } from "@/components/admin/responsive-grid";
import { AdminCard } from "@/components/admin/admin-card";

export default function AdminDashboardPage() {
  const router = useRouter();
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
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication first
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const session = await response.json();
          if (!session?.user) {
            router.push('/admin/login');
            return;
          }
          const userRole = (session.user as any).role;
          const adminRoles = ["SUPER_ADMIN", "ADMIN", "CONTENT_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"];
          if (!userRole || !adminRoles.includes(userRole as string)) {
            router.push('/');
            return;
          }
        } else {
          router.push('/admin/login');
          return;
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
        return;
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Only fetch data if authenticated
    if (!authChecked) return;

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
  }, [authChecked]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#5F3C18]">Checking authentication...</div>
      </div>
    );
  }

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
        <div className="p-5 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }}>
        <StatCard
          title="Total Products"
          value={kpiData.totalProducts}
          subtitle={`${kpiData.activeProducts} active • ${kpiData.outOfStockProducts} out of stock`}
          icon={<Smartphone className="h-5 w-5 text-[#CDB586]" />}
        />
        <StatCard
          title="Total Orders"
          value={kpiData.totalOrders}
          subtitle={`${kpiData.pendingOrders} pending • ${kpiData.completedOrders} completed`}
          icon={<ShoppingBag className="h-5 w-5 text-[#CDB586]" />}
        />
        <StatCard
          title="Revenue"
          value={`$${kpiData.totalRevenue.toLocaleString()}`}
          subtitle={`From ${kpiData.completedOrders} paid orders`}
          icon={<DollarSign className="h-5 w-5 text-[#CDB586]" />}
        />
        <StatCard
          title="Customers"
          value={kpiData.totalCustomers}
          subtitle="Registered customers"
          icon={<Users className="h-5 w-5 text-[#CDB586]" />}
        />
      </ResponsiveGrid>

      {/* Additional KPI Cards */}
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }}>
        <StatCard
          title="Trade-In Requests"
          value={kpiData.tradeInRequests}
          subtitle={`${kpiData.newTradeIns} new requests`}
          icon={<ArrowRight className="h-5 w-5 text-[#CDB586]" />}
        />
        <StatCard
          title="Enquiries"
          value={kpiData.enquiries}
          subtitle={`${kpiData.newEnquiries} pending response`}
          icon={<MessageSquare className="h-5 w-5 text-[#CDB586]" />}
        />
        <StatCard
          title="Pending Reviews"
          value={kpiData.pendingReviews}
          subtitle="Awaiting moderation"
          icon={<Activity className="h-5 w-5 text-[#CDB586]" />}
        />
        <StatCard
          title="Low Stock Alert"
          value={kpiData.lowStockProducts.length}
          subtitle="Items need restocking"
          icon={<AlertTriangle className="h-5 w-5 text-[#CDB586]" />}
        />
      </ResponsiveGrid>

      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }}>
        <StatCard
          title="Payment Verification"
          value={kpiData.pendingPaymentVerification}
          subtitle={`${kpiData.manualReviewPayments} need review`}
          icon={<Clock className="h-5 w-5 text-[#CDB586]" />}
        />
        <StatCard
          title="Verified Payments"
          value={kpiData.verifiedPayments}
          subtitle={`$${kpiData.totalVerifiedRevenue.toLocaleString()} verified`}
          icon={<TrendingUp className="h-5 w-5 text-green-600" />}
        />
        <StatCard
          title="Today's EcoCash"
          value={kpiData.todayEcoCashPayments}
          subtitle={`${kpiData.unmatchedSmsTransactions} unmatched SMS`}
          icon={<Smartphone className="h-5 w-5 text-[#CDB586]" />}
        />
      </ResponsiveGrid>

      {/* Quick Actions */}
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }}>
        <Link href="/admin/products/new">
          <div className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                <Plus className="h-5 w-5 text-[#CDB586]" />
              </div>
              <span className="text-[#EBE2C5] font-medium text-sm">Add New Product</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/orders">
          <div className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="h-5 w-5 text-[#CDB586]" />
              </div>
              <span className="text-[#EBE2C5] font-medium text-sm">View Orders ({kpiData.pendingOrders} pending)</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/trade-in">
          <div className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                <ArrowRight className="h-5 w-5 text-[#CDB586]" />
              </div>
              <span className="text-[#EBE2C5] font-medium text-sm">Trade-Ins ({kpiData.newTradeIns} new)</span>
            </div>
          </div>
        </Link>

        <Link href="/admin/enquiries">
          <div className="bg-gradient-to-br from-[#0E161B] to-[#1A1A20] border border-[#CDB586]/30 hover:border-[#CDB586] transition-all duration-200 cursor-pointer hover:shadow-lg rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#CDB586]/20 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-5 w-5 text-[#CDB586]" />
              </div>
              <span className="text-[#EBE2C5] font-medium text-sm">Enquiries ({kpiData.newEnquiries} pending)</span>
            </div>
          </div>
        </Link>
      </ResponsiveGrid>

      {/* Dashboard Panels */}
      <ResponsiveGrid cols={{ default: 1, lg: 2 }}>
        {/* Recent Orders */}
        <AdminCard title="Recent Orders">
          <div className="flex justify-end mb-4">
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="text-[#CDB586] hover:bg-[#CDB586]/10 font-medium">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
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
        </AdminCard>

        {/* Recent Customers */}
        <AdminCard title="Recent Customers">
          <div className="flex justify-end mb-4">
            <Link href="/admin/customers">
              <Button variant="ghost" size="sm" className="text-[#CDB586] hover:bg-[#CDB586]/10 font-medium">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
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
        </AdminCard>
      </ResponsiveGrid>
    </div>
    </AdminPageContainer>
  );
}