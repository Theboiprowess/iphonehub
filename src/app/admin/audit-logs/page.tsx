"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileSearch, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Calendar,
  User,
  Activity,
  Code,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Plus
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

type AuditLog = {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  changes?: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        ...(filterAction && { action: filterAction }),
        ...(filterEntity && { entity: filterEntity }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/audit-logs?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch audit logs");
      }
      const data = await response.json();
      setLogs(data.logs);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filterAction, filterEntity, searchQuery]);

  const getActionIcon = (action: string) => {
    if (action.includes("CREATE") || action.includes("ADDED")) return <Plus className="h-4 w-4 text-green-600" />;
    if (action.includes("UPDATE") || action.includes("EDIT") || action.includes("MODIFIED")) return <Edit className="h-4 w-4 text-blue-600" />;
    if (action.includes("DELETE") || action.includes("REMOVED")) return <Trash className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getActionBadge = (action: string) => {
    if (action.includes("CREATE") || action.includes("ADDED")) return "bg-green-100 text-green-800";
    if (action.includes("UPDATE") || action.includes("EDIT") || action.includes("MODIFIED")) return "bg-blue-100 text-blue-800";
    if (action.includes("DELETE") || action.includes("REMOVED")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      SUPER_ADMIN: "bg-purple-100 text-purple-800",
      ADMIN: "bg-blue-100 text-blue-800",
      CONTENT_MANAGER: "bg-green-100 text-green-800",
      INVENTORY_MANAGER: "bg-orange-100 text-orange-800",
      ORDER_MANAGER: "bg-yellow-100 text-yellow-800",
      CUSTOMER: "bg-gray-100 text-gray-800",
    };
    return badges[role] || "bg-gray-100 text-gray-800";
  };

  const formatChanges = (changes: any) => {
    if (!changes) return null;
    try {
      return JSON.stringify(changes, null, 2);
    } catch {
      return String(changes);
    }
  };

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="space-y-8 admin-page-container">
          <AdminPageHeader title="Audit Logs" subtitle="View system audit logs" />
          <div className="flex items-center justify-center h-64">
            <div className="text-[#5F3C18]">Loading audit logs...</div>
          </div>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container">
        <AdminPageHeader title="Audit Logs" subtitle="View system audit logs" />

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]/50" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actions</SelectItem>
                  <SelectItem value="CREATE">Create</SelectItem>
                  <SelectItem value="UPDATE">Update</SelectItem>
                  <SelectItem value="DELETE">Delete</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Entities</SelectItem>
                  <SelectItem value="Product">Product</SelectItem>
                  <SelectItem value="Order">Order</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                  <SelectItem value="Settings">Settings</SelectItem>
                </SelectContent>
              </Select>
              {(filterAction || filterEntity || searchQuery) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilterAction("");
                    setFilterEntity("");
                    setSearchQuery("");
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Audit Logs ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <FileSearch className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No audit logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Timestamp</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">User</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Action</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Entity</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Changes</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-[#5F3C18]">
                          <Calendar className="h-4 w-4 text-[#CDB586]" />
                          {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#CDB586]" />
                          <div>
                            <div className="font-medium text-[#0E161B]">{log.user.name}</div>
                            <div className="text-sm text-[#5F3C18]/60">{log.user.email}</div>
                            <Badge className={`${getRoleBadge(log.user.role)} mt-1 text-xs`}>
                              {log.user.role.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <Badge className={getActionBadge(log.action)}>
                            {log.action.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-[#CDB586]" />
                          <span className="font-medium text-[#0E161B]">{log.entity}</span>
                          {log.entityId && (
                            <span className="text-sm text-[#5F3C18]/60">#{log.entityId.slice(0, 8)}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {log.changes ? (
                          <details className="cursor-pointer">
                            <summary className="text-sm text-[#5F3C18] hover:text-[#0E161B]">
                              View changes
                            </summary>
                            <pre className="mt-2 text-xs bg-[#F7F5EF] p-2 rounded overflow-x-auto max-w-md">
                              {formatChanges(log.changes)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-sm text-[#5F3C18]/60">No changes</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#CDB586]/20">
              <div className="text-sm text-[#5F3C18]/60">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </AdminPageContainer>
  );
}
