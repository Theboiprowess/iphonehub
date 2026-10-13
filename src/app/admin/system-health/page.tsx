"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Database,
  RefreshCw,
  Package,
  ShoppingCart,
  Users,
  AlertCircle,
  Clock
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

type SystemHealthData = {
  status: "healthy" | "degraded" | "unhealthy";
  checks: {
    database: {
      status: string;
      latency: number;
    };
  };
  stats: {
    products: number;
    orders: number;
    users: number;
    lowStock: number;
    pendingOrders: number;
    pendingEnquiries: number;
  };
  recentErrors: Array<{
    action: string;
    entity: string;
    createdAt: string;
  }>;
  timestamp: string;
};

export default function SystemHealthPage() {
  const [data, setData] = useState<SystemHealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/admin/api/system-health");
      if (!response.ok) {
        throw new Error("Failed to fetch system health");
      }
      const healthData = await response.json();
      setData(healthData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch system health");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "healthy") return "text-green-600";
    if (status === "degraded") return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (status: string) => {
    if (status === "healthy") return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (status === "degraded") return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="space-y-8 admin-page-container">
          <AdminPageHeader title="System Health" subtitle="Monitor system health" />
          <div className="flex items-center justify-center h-64">
            <div className="text-[#5F3C18]">Loading system health...</div>
          </div>
        </div>
      </AdminPageContainer>
    );
  }

  if (!data) {
    return (
      <AdminPageContainer>
        <div className="space-y-8 admin-page-container">
          <AdminPageHeader title="System Health" subtitle="Monitor system health" />
          <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
            No data available
          </div>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container">
        <AdminPageHeader title="System Health" subtitle="Monitor system health">
          <Button onClick={fetchHealth} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </AdminPageHeader>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Overall Status */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className={`h-8 w-8 ${getStatusColor(data.status)}`} />
              <div>
                <p className="text-sm text-[#5F3C18]/60">System Status</p>
                <p className={`text-2xl font-bold ${getStatusColor(data.status)}`}>
                  {data.status.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="text-sm text-[#5F3C18]/60">
              Last updated: {new Date(data.timestamp).toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Checks */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Health Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#F7F5EF]/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-[#CDB586]" />
                <div>
                  <div className="font-medium text-[#0E161B]">Database</div>
                  <div className="text-sm text-[#5F3C18]/60">PostgreSQL connection</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-[#5F3C18]/60">
                  {data.checks.database.latency}ms
                </div>
                {getStatusIcon(data.checks.database.status)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>System Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F7F5EF]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-4 w-4 text-[#CDB586]" />
                <span className="text-sm text-[#5F3C18]/60">Products</span>
              </div>
              <div className="text-2xl font-bold text-[#0E161B]">{data.stats.products}</div>
            </div>
            <div className="p-4 bg-[#F7F5EF]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className="h-4 w-4 text-[#CDB586]" />
                <span className="text-sm text-[#5F3C18]/60">Orders</span>
              </div>
              <div className="text-2xl font-bold text-[#0E161B]">{data.stats.orders}</div>
            </div>
            <div className="p-4 bg-[#F7F5EF]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-[#CDB586]" />
                <span className="text-sm text-[#5F3C18]/60">Users</span>
              </div>
              <div className="text-2xl font-bold text-[#0E161B]">{data.stats.users}</div>
            </div>
            <div className="p-4 bg-[#F7F5EF]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-[#5F3C18]/60">Low Stock Items</span>
              </div>
              <div className="text-2xl font-bold text-[#0E161B]">{data.stats.lowStock}</div>
            </div>
            <div className="p-4 bg-[#F7F5EF]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[#CDB586]" />
                <span className="text-sm text-[#5F3C18]/60">Pending Orders</span>
              </div>
              <div className="text-2xl font-bold text-[#0E161B]">{data.stats.pendingOrders}</div>
            </div>
            <div className="p-4 bg-[#F7F5EF]/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-[#CDB586]" />
                <span className="text-sm text-[#5F3C18]/60">Pending Enquiries</span>
              </div>
              <div className="text-2xl font-bold text-[#0E161B]">{data.stats.pendingEnquiries}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      {data.recentErrors.length > 0 && (
        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardHeader>
            <CardTitle>Recent Errors (Last 24 Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recentErrors.map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-900/10 border border-red-500/20 rounded-lg">
                  <div>
                    <div className="font-medium text-[#0E161B]">{error.action}</div>
                    <div className="text-sm text-[#5F3C18]/60">{error.entity}</div>
                  </div>
                  <div className="text-sm text-[#5F3C18]/60">
                    {new Date(error.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </AdminPageContainer>
  );
}
