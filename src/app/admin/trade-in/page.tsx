"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MessageSquare, 
  Search, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Smartphone,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  MessageCircle,
  User
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { formatPrice } from "@/lib/utils";

type TradeIn = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  currentModel: string;
  storage?: string;
  condition?: string;
  batteryHealth?: number;
  colour?: string;
  accessories?: string;
  powersOn?: boolean;
  touchscreenWorking?: boolean;
  camerasWorking?: boolean;
  faceIdWorking?: boolean;
  chargingPortWorking?: boolean;
  beenRepaired?: boolean;
  hasCracks?: boolean;
  liquidDamage?: boolean;
  otherAccessories?: string;
  photos?: string[];
  notes?: string;
  adminNotes?: string;
  estimatedValue?: number;
  finalOffer?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function TradeInPage() {
  const [tradeIns, setTradeIns] = useState<TradeIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTradeIn, setSelectedTradeIn] = useState<TradeIn | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);

  const tradeInStatuses = [
    "NEW",
    "UNDER_REVIEW",
    "MORE_INFO_REQUIRED",
    "ESTIMATED",
    "OFFER_SENT",
    "ACCEPTED",
    "DECLINED",
    "COMPLETED",
    "CANCELLED",
  ];

  const fetchTradeIns = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(statusFilter && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/trade-in?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch trade-ins");
      }
      const data = await response.json();
      setTradeIns(data.tradeIns);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch trade-ins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradeIns();
  }, [page, statusFilter, searchQuery]);

  const updateTradeIn = async (tradeInId: string, updateData: any) => {
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/trade-in`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tradeInId, ...updateData }),
      });
      if (!response.ok) {
        throw new Error("Failed to update trade-in");
      }
      await fetchTradeIns();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const deleteTradeIn = async (tradeInId: string) => {
    if (!confirm("Are you sure you want to delete this trade-in request?")) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/trade-in?id=${tradeInId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete trade-in");
      }
      await fetchTradeIns();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const sendWhatsApp = (tradeIn: TradeIn) => {
    const message = `Hello ${tradeIn.name}, regarding your trade-in request for ${tradeIn.currentModel}: ${tradeIn.status.replace(/_/g, " ")}. Please contact us for more information.`;
    const phone = tradeIn.whatsapp || tradeIn.phone;
    const whatsappUrl = `https://wa.me/263${phone.replace(/^0/, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-800",
      UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
      MORE_INFO_REQUIRED: "bg-orange-100 text-orange-800",
      ESTIMATED: "bg-purple-100 text-purple-800",
      OFFER_SENT: "bg-indigo-100 text-indigo-800",
      ACCEPTED: "bg-green-100 text-green-800",
      DECLINED: "bg-red-100 text-red-800",
      COMPLETED: "bg-emerald-100 text-emerald-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Trade-In Requests" subtitle="Manage trade-in requests" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading trade-ins...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Trade-In Requests" subtitle="Manage trade-in requests" />

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
                  placeholder="Search trade-ins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {tradeInStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trade-ins Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Trade-In Requests ({tradeIns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {tradeIns.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No trade-in requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Device</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Condition</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Est. Value</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Status</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Date</th>
                    <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tradeIns.map((tradeIn) => (
                    <tr key={tradeIn.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{tradeIn.name}</div>
                        <div className="text-sm text-[#5F3C18]/60">{tradeIn.phone}</div>
                        {tradeIn.email && <div className="text-sm text-[#5F3C18]/60">{tradeIn.email}</div>}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-[#0E161B]">{tradeIn.currentModel}</div>
                        {tradeIn.storage && <div className="text-sm text-[#5F3C18]/60">{tradeIn.storage}</div>}
                        {tradeIn.colour && <div className="text-sm text-[#5F3C18]/60">{tradeIn.colour}</div>}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          {tradeIn.batteryHealth && (
                            <div className="text-sm">
                              <span className={tradeIn.batteryHealth >= 80 ? "text-green-600" : tradeIn.batteryHealth >= 60 ? "text-yellow-600" : "text-red-600"}>
                                Battery: {tradeIn.batteryHealth}%
                              </span>
                            </div>
                          )}
                          {tradeIn.powersOn !== undefined && (
                            <div className="text-sm text-[#5F3C18]/60">
                              Powers On: {tradeIn.powersOn ? "Yes" : "No"}
                            </div>
                          )}
                          {tradeIn.hasCracks && (
                            <div className="text-sm text-red-600">Has Cracks</div>
                          )}
                          {tradeIn.liquidDamage && (
                            <div className="text-sm text-red-600">Liquid Damage</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {tradeIn.estimatedValue ? (
                          <div className="font-semibold text-[#0E161B]">{formatPrice(tradeIn.estimatedValue)}</div>
                        ) : (
                          <span className="text-[#5F3C18]/60">Not estimated</span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusBadge(tradeIn.status)}>
                          {tradeIn.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-[#5F3C18]">
                          {new Date(tradeIn.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedTradeIn(tradeIn)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Trade-In Request Details</DialogTitle>
                              </DialogHeader>
                              {selectedTradeIn && (
                                <div className="space-y-6">
                                  {/* Customer Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      Customer Information
                                    </h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                                      <div><strong>Name:</strong> {selectedTradeIn.name}</div>
                                      <div><strong>Phone:</strong> {selectedTradeIn.phone}</div>
                                      {selectedTradeIn.whatsapp && (
                                        <div><strong>WhatsApp:</strong> {selectedTradeIn.whatsapp}</div>
                                      )}
                                      {selectedTradeIn.email && <div><strong>Email:</strong> {selectedTradeIn.email}</div>}
                                    </div>
                                  </div>

                                  {/* Device Info */}
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                                      <Smartphone className="h-4 w-4" />
                                      Device Information
                                    </h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg space-y-2">
                                      <div><strong>Model:</strong> {selectedTradeIn.currentModel}</div>
                                      {selectedTradeIn.storage && <div><strong>Storage:</strong> {selectedTradeIn.storage}</div>}
                                      {selectedTradeIn.colour && <div><strong>Colour:</strong> {selectedTradeIn.colour}</div>}
                                      {selectedTradeIn.condition && <div><strong>Condition:</strong> {selectedTradeIn.condition}</div>}
                                      {selectedTradeIn.batteryHealth && (
                                        <div><strong>Battery Health:</strong> {selectedTradeIn.batteryHealth}%</div>
                                      )}
                                      {selectedTradeIn.accessories && (
                                        <div><strong>Accessories:</strong> {selectedTradeIn.accessories}</div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Device Status */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Device Status</h4>
                                    <div className="bg-[#F7F5EF] p-4 rounded-lg grid grid-cols-2 gap-2">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className={`h-4 w-4 ${selectedTradeIn.powersOn ? "text-green-600" : "text-red-600"}`} />
                                        <span>Powers On: {selectedTradeIn.powersOn ? "Yes" : "No"}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className={`h-4 w-4 ${selectedTradeIn.touchscreenWorking ? "text-green-600" : "text-red-600"}`} />
                                        <span>Touchscreen: {selectedTradeIn.touchscreenWorking ? "Yes" : "No"}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className={`h-4 w-4 ${selectedTradeIn.camerasWorking ? "text-green-600" : "text-red-600"}`} />
                                        <span>Cameras: {selectedTradeIn.camerasWorking ? "Yes" : "No"}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className={`h-4 w-4 ${selectedTradeIn.faceIdWorking ? "text-green-600" : "text-red-600"}`} />
                                        <span>Face ID: {selectedTradeIn.faceIdWorking ? "Yes" : "No"}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className={`h-4 w-4 ${selectedTradeIn.chargingPortWorking ? "text-green-600" : "text-red-600"}`} />
                                        <span>Charging Port: {selectedTradeIn.chargingPortWorking ? "Yes" : "No"}</span>
                                      </div>
                                      {selectedTradeIn.beenRepaired !== undefined && (
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className={`h-4 w-4 ${selectedTradeIn.beenRepaired ? "text-orange-600" : "text-gray-400"}`} />
                                          <span>Previously Repaired: {selectedTradeIn.beenRepaired ? "Yes" : "No"}</span>
                                        </div>
                                      )}
                                      {selectedTradeIn.hasCracks && (
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className="h-4 w-4 text-red-600" />
                                          <span>Has Cracks</span>
                                        </div>
                                      )}
                                      {selectedTradeIn.liquidDamage && (
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className="h-4 w-4 text-red-600" />
                                          <span>Liquid Damage</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Customer Notes */}
                                  {selectedTradeIn.notes && (
                                    <div>
                                      <h4 className="font-semibold mb-2">Customer Notes</h4>
                                      <div className="bg-[#F7F5EF] p-4 rounded-lg">
                                        {selectedTradeIn.notes}
                                      </div>
                                    </div>
                                  )}

                                  {/* Valuation */}
                                  <div className="space-y-4">
                                    <h4 className="font-semibold flex items-center gap-2">
                                      <DollarSign className="h-4 w-4" />
                                      Valuation
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Estimated Value</Label>
                                        <Input
                                          type="number"
                                          value={selectedTradeIn.estimatedValue || ""}
                                          onChange={(e) => updateTradeIn(selectedTradeIn.id, { estimatedValue: parseFloat(e.target.value) || null })}
                                          placeholder="0.00"
                                          disabled={updating}
                                        />
                                      </div>
                                      <div>
                                        <Label>Final Offer</Label>
                                        <Input
                                          type="number"
                                          value={selectedTradeIn.finalOffer || ""}
                                          onChange={(e) => updateTradeIn(selectedTradeIn.id, { finalOffer: parseFloat(e.target.value) || null })}
                                          placeholder="0.00"
                                          disabled={updating}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Status Management */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Status</h4>
                                    <Select 
                                      value={selectedTradeIn.status} 
                                      onValueChange={(value) => updateTradeIn(selectedTradeIn.id, { status: value })}
                                      disabled={updating}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {tradeInStatuses.map((status) => (
                                          <SelectItem key={status} value={status}>
                                            {status.replace(/_/g, " ")}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  {/* Admin Notes */}
                                  <div>
                                    <h4 className="font-semibold mb-2">Admin Notes</h4>
                                    <Textarea
                                      value={selectedTradeIn.adminNotes || ""}
                                      onChange={(e) => updateTradeIn(selectedTradeIn.id, { adminNotes: e.target.value })}
                                      placeholder="Add internal notes..."
                                      rows={3}
                                      disabled={updating}
                                    />
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => sendWhatsApp(selectedTradeIn)}
                                      className="flex-1"
                                    >
                                      <MessageCircle className="h-4 w-4 mr-2" />
                                      WhatsApp Customer
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteTradeIn(tradeIn.id)}
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
