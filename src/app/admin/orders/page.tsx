"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  DollarSign,
  User,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { formatPrice } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsapp?: string;
  deliveryAddress?: string;
  city?: string;
  orderNotes?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    variant: {
      id: string;
      storage: string;
      colour: string;
      product: {
        id: string;
        name: string;
        condition: string;
      };
    };
  }>;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);

  // Status options
  const orderStatuses = [
    "PENDING_PAYMENT",
    "PAYMENT_PROCESSING",
    "PAID",
    "CONFIRMED",
    "PROCESSING",
    "READY_FOR_PICKUP",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];

  const paymentStatuses = [
    "PENDING",
    "AWAITING_PROOF",
    "PROOF_SUBMITTED",
    "MATCHING",
    "VERIFIED",
    "APPROVED",
    "MISMATCH",
    "MANUAL_REVIEW",
    "REJECTED",
    "EXPIRED",
    "REFUNDED",
  ];

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(statusFilter && { status: statusFilter }),
        ...(paymentStatusFilter && { paymentStatus: paymentStatusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/orders?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, paymentStatusFilter, searchQuery]);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
      await fetchOrders();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, paymentStatus: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }
      await fetchOrders();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/orders?id=${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }
      await fetchOrders();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING_PAYMENT: "bg-yellow-100 text-yellow-800",
      PAYMENT_PROCESSING: "bg-blue-100 text-blue-800",
      PAID: "bg-green-100 text-green-800",
      CONFIRMED: "bg-emerald-100 text-emerald-800",
      PROCESSING: "bg-purple-100 text-purple-800",
      READY_FOR_PICKUP: "bg-indigo-100 text-indigo-800",
      OUT_FOR_DELIVERY: "bg-orange-100 text-orange-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-gray-100 text-gray-800",
      AWAITING_PROOF: "bg-yellow-100 text-yellow-800",
      PROOF_SUBMITTED: "bg-blue-100 text-blue-800",
      MATCHING: "bg-purple-100 text-purple-800",
      VERIFIED: "bg-green-100 text-green-800",
      APPROVED: "bg-emerald-100 text-emerald-800",
      MISMATCH: "bg-red-100 text-red-800",
      MANUAL_REVIEW: "bg-orange-100 text-orange-800",
      REJECTED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Orders" subtitle="Manage customer orders" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Orders" subtitle="Manage customer orders" />

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
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payment Statuses</SelectItem>
                {paymentStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <Package className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Order #</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Total</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Status</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Payment</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Date</th>
                    <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{order.orderNumber}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-[#0E161B]">{order.customerName}</div>
                        <div className="text-sm text-[#5F3C18]/60">{order.customerEmail}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-[#0E161B]">{formatPrice(order.total)}</div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(order.status)}>
                          {order.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getPaymentStatusBadge(order.paymentStatus)}>
                          {order.paymentStatus.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Order Details - {order.orderNumber}</DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Customer Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Customer Information
                                    </h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                                      <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                                      <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                                      <div><strong>Phone:</strong> {selectedOrder.customerPhone}</div>
                                      {selectedOrder.customerWhatsapp && (
                                        <div><strong>WhatsApp:</strong> {selectedOrder.customerWhatsapp}</div>
                                      )}
                                      {selectedOrder.deliveryAddress && (
                                        <div className="flex items-start gap-2">
                                          <MapPin className="h-4 w-4 mt-0.5" />
                                          <div>
                                            <strong>Address:</strong> {selectedOrder.deliveryAddress}
                                            {selectedOrder.city && `, ${selectedOrder.city}`}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Order Items</h4>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="bg-[#F7F5EF] p-4 rounded-lg flex justify-between items-center">
                                          <div>
                                            <div className="font-medium">{item.variant.product.name}</div>
                                            <div className="text-sm text-[#5F3C18]/60">
                                              {item.variant.storage} • {item.variant.colour} • {item.variant.product.condition}
                                            </div>
                                            <div className="text-sm">Qty: {item.quantity}</div>
                                          </div>
                                          <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Totals */}
                                  <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Delivery:</span>
                                      <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                      <span>Total:</span>
                                      <span>{formatPrice(selectedOrder.total)}</span>
                                    </div>
                                  </div>

                                  {/* Notes */}
                                  {selectedOrder.orderNotes && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Order Notes</h4>
                                      <div className="bg-[#F7F5EF] p-4 rounded-lg">
                                        {selectedOrder.orderNotes}
                                      </div>
                                    </div>
                                  )}

                                  {/* Status Management */}
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">Order Status</h4>
                                      <Select 
                                        value={selectedOrder.status} 
                                        onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                        disabled={updating}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {orderStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                              {status.replace(/_/g, " ")}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">Payment Status</h4>
                                      <Select 
                                        value={selectedOrder.paymentStatus} 
                                        onValueChange={(value) => updatePaymentStatus(selectedOrder.id, value)}
                                        disabled={updating}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {paymentStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                              {status.replace(/_/g, " ")}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          {order.status !== "CANCELLED" && order.status !== "DELIVERED" && order.status !== "REFUNDED" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => cancelOrder(order.id)}
                              disabled={updating}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                        </div>
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
  );
}
