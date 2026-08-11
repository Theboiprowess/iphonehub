"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  ShoppingBag,
  Star,
  Heart,
  Calendar,
  MapPin
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { formatPrice } from "@/lib/utils";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: string;
  createdAt: string;
  _count: {
    orders: number;
    reviews: number;
    wishlist: number;
  };
};

type CustomerDetail = Customer & {
  orders: Array<{
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    items: Array<{
      variant: {
        product: {
          name: string;
        };
      };
    }>;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    title?: string;
    comment: string;
    product: {
      name: string;
    };
    createdAt: string;
  }>;
  wishlist: {
    items: Array<{
      variant: {
        product: {
          name: string;
        };
      };
    }>;
  };
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/customers?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data.customers);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, searchQuery]);

  const fetchCustomerDetail = async (customerId: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/customers/${customerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch customer details");
      }
      const data = await response.json();
      setSelectedCustomer(data.customer);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const updateCustomer = async (customerId: string, updateData: any) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/customers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: customerId, ...updateData }),
      });
      if (!response.ok) {
        throw new Error("Failed to update customer");
      }
      await fetchCustomers();
      if (selectedCustomer?.id === customerId) {
        await fetchCustomerDetail(customerId);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/customers?id=${customerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }
      await fetchCustomers();
      setSelectedCustomer(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      CUSTOMER: "bg-blue-100 text-blue-800",
      ADMIN: "bg-purple-100 text-purple-800",
      SUPER_ADMIN: "bg-red-100 text-red-800",
      CONTENT_MANAGER: "bg-green-100 text-green-800",
      INVENTORY_MANAGER: "bg-orange-100 text-orange-800",
      ORDER_MANAGER: "bg-indigo-100 text-indigo-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Customers" subtitle="Manage customer accounts" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading customers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Customers" subtitle="Manage customer accounts" />

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Search */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]/50" />
            <Input
              placeholder="Search customers by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Customers ({customers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <Users className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Contact</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Orders</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Reviews</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Wishlist</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Joined</th>
                    <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{customer.name}</div>
                        <Badge className={`${getRoleBadge(customer.role)} mt-1`}>
                          {customer.role.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]/60">{customer.email}</div>
                        {customer.phone && <div className="text-sm text-[#5F3C18]/60">{customer.phone}</div>}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-[#5F3C18]/60" />
                          <span className="font-medium text-[#0E161B]">{customer._count.orders}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-[#5F3C18]/60" />
                          <span className="font-medium text-[#0E161B]">{customer._count.reviews}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-[#5F3C18]/60" />
                          <span className="font-medium text-[#0E161B]">{customer._count.wishlist}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => fetchCustomerDetail(customer.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Customer Details - {selectedCustomer?.name}</DialogTitle>
                              </DialogHeader>
                              {selectedCustomer && (
                                <div className="space-y-6">
                                  {/* Contact Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      Contact Information
                                    </h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                                      <div><strong>Name:</strong> {selectedCustomer.name}</div>
                                      <div><strong>Email:</strong> {selectedCustomer.email}</div>
                                      {selectedCustomer.phone && <div><strong>Phone:</strong> {selectedCustomer.phone}</div>}
                                      {selectedCustomer.whatsapp && <div><strong>WhatsApp:</strong> {selectedCustomer.whatsapp}</div>}
                                      <div><strong>Role:</strong> {selectedCustomer.role.replace(/_/g, " ")}</div>
                                      <div><strong>Joined:</strong> {new Date(selectedCustomer.createdAt).toLocaleDateString()}</div>
                                    </div>
                                  </div>

                                  {/* Order History */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <ShoppingBag className="h-4 w-4" />
                                      Order History ({selectedCustomer.orders.length})
                                    </h4>
                                    {selectedCustomer.orders.length === 0 ? (
                                      <div className="bg-[#F7F5EF] p-4 rounded-lg text-center text-[#5F3C18]/60">
                                        No orders yet
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        {selectedCustomer.orders.map((order) => (
                                          <div key={order.id} className="bg-[#F7F5EF] p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                              <div>
                                                <div className="font-medium text-[#0E161B]">{order.orderNumber}</div>
                                                <div className="text-sm text-[#5F3C18]/60">
                                                  {order.items.map((item) => item.variant.product.name).join(", ")}
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="font-semibold text-[#0E161B]">{formatPrice(order.total)}</div>
                                                <div className="text-xs text-[#5F3C18]/60">
                                                  {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                              <Badge className="bg-yellow-100 text-yellow-800">
                                                {order.status.replace(/_/g, " ")}
                                              </Badge>
                                              <Badge className="bg-blue-100 text-blue-800">
                                                {order.paymentStatus.replace(/_/g, " ")}
                                              </Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Reviews */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Star className="h-4 w-4" />
                                      Reviews ({selectedCustomer.reviews.length})
                                    </h4>
                                    {selectedCustomer.reviews.length === 0 ? (
                                      <div className="bg-[#F7F5EF] p-4 rounded-lg text-center text-[#5F3C18]/60">
                                        No reviews yet
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        {selectedCustomer.reviews.map((review) => (
                                          <div key={review.id} className="bg-[#F7F5EF] p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                              <div>
                                                <div className="font-medium text-[#0E161B]">{review.product.name}</div>
                                                {review.title && <div className="text-sm text-[#5F3C18]/60">{review.title}</div>}
                                              </div>
                                              <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                  <Star 
                                                    key={i} 
                                                    className={`h-4 w-4 ${i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`} 
                                                  />
                                                ))}
                                              </div>
                                            </div>
                                            <div className="text-sm text-[#0E161B] mt-2">{review.comment}</div>
                                            <div className="text-xs text-[#5F3C18]/60 mt-1">
                                              {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Wishlist */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Heart className="h-4 w-4" />
                                      Wishlist ({selectedCustomer.wishlist?.items?.length || 0})
                                    </h4>
                                    {selectedCustomer.wishlist?.items && selectedCustomer.wishlist.items.length === 0 ? (
                                      <div className="bg-[#F7F5EF] p-4 rounded-lg text-center text-[#5F3C18]/60">
                                        Wishlist is empty
                                      </div>
                                    ) : (
                                      <div className="space-y-2">
                                        {selectedCustomer.wishlist?.items.map((item, idx) => (
                                          <div key={idx} className="bg-[#F7F5EF] p-4 rounded-lg">
                                            <div className="font-medium text-[#0E161B]">
                                              {item.variant.product.name}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteCustomer(customer.id)}
                            disabled={updating}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
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
