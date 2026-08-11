"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Box, 
  Search, 
  AlertTriangle, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight,
  Package,
  TrendingUp,
  TrendingDown,
  History,
  Warehouse
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { formatPrice } from "@/lib/utils";

type InventoryItem = {
  id: string;
  variantId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  soldStock: number;
  lowStockThreshold: number;
  location?: string;
  lastStockUpdate: string;
  variant: {
    id: string;
    storage: string;
    colour: string;
    price: number;
    sku?: string;
    product: {
      id: string;
      name: string;
      condition: string;
      category: {
        name: string;
      };
    };
  };
  movements: Array<{
    id: string;
    previousStock: number;
    newStock: number;
    difference: number;
    reason: string;
    notes?: string;
    createdAt: string;
  }>;
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState(false);

  // Stock adjustment dialog state
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [adjustmentNotes, setAdjustmentNotes] = useState("");

  const adjustmentReasons = [
    "STOCK_ADD",
    "STOCK_REMOVE",
    "STOCK_ADJUST",
    "STOCK_RESERVE",
    "STOCK_RELEASE",
    "STOCK_SOLD",
    "STOCK_RESTOCK",
    "DAMAGED",
    "RETURNED",
    "MANUAL_ADJUST",
  ];

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        ...(lowStockOnly && { lowStockOnly: "true" }),
        ...(outOfStockOnly && { outOfStockOnly: "true" }),
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/inventory?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch inventory");
      }
      const data = await response.json();
      setInventory(data.inventory);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [page, lowStockOnly, outOfStockOnly, searchQuery]);

  const adjustStock = async (variantId: string) => {
    if (adjustmentAmount === 0) {
      setError("Adjustment amount cannot be zero");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/admin/api/inventory`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          adjustment: adjustmentAmount,
          reason: adjustmentReason,
          notes: adjustmentNotes,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to adjust stock");
      }
      await fetchInventory();
      setAdjustmentAmount(0);
      setAdjustmentReason("");
      setAdjustmentNotes("");
      setSelectedItem(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.availableStock <= 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (item.availableStock <= item.lowStockThreshold) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", color: "bg-green-100 text-green-800" };
  };

  const getReasonLabel = (reason: string) => {
    return reason.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <AdminPageHeader title="Inventory" subtitle="Manage inventory and stock" />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#5F3C18]">Loading inventory...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Inventory" subtitle="Manage inventory and stock" />

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
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={lowStockOnly ? "default" : "outline"}
                onClick={() => setLowStockOnly(!lowStockOnly)}
                className={lowStockOnly ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Low Stock
              </Button>
              <Button
                variant={outOfStockOnly ? "default" : "outline"}
                onClick={() => setOutOfStockOnly(!outOfStockOnly)}
                className={outOfStockOnly ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <Box className="h-4 w-4 mr-2" />
                Out of Stock
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardHeader>
          <CardTitle>Inventory ({inventory.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          {inventory.length === 0 ? (
            <div className="text-center py-12 text-[#5F3C18]/60">
              <Warehouse className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
              <p>No inventory found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#CDB586]/20">
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Product</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Variant</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Current Stock</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Available</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Reserved</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Sold</th>
                    <th className="text-left p-4 font-semibold text-[#0E161B]">Status</th>
                    <th className="text-right p-4 font-semibold text-[#0E161B]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <tr key={item.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                        <td className="p-4">
                          <div className="font-medium text-[#0E161B]">{item.variant.product.name}</div>
                          <div className="text-sm text-[#5F3C18]/60">{item.variant.product.category.name}</div>
                          <div className="text-sm text-[#5F3C18]/60">{item.variant.product.condition}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-[#0E161B]">{item.variant.storage}</div>
                          <div className="text-sm text-[#5F3C18]/60">{item.variant.colour}</div>
                          {item.variant.sku && <div className="text-xs text-[#5F3C18]/60">SKU: {item.variant.sku}</div>}
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#0E161B]">{item.currentStock}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-[#0E161B]">{item.availableStock}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-[#5F3C18]">{item.reservedStock}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-[#5F3C18]">{item.soldStock}</div>
                        </td>
                        <td className="p-4">
                          <Badge className={status.color}>{status.label}</Badge>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                  <History className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Inventory Details - {selectedItem?.variant.product.name}</DialogTitle>
                                </DialogHeader>
                                {selectedItem && (
                                  <div className="space-y-6">
                                    {/* Current Stock */}
                                    <div>
                                      <h4 className="font-semibold mb-2">Current Stock Levels</h4>
                                      <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-[#F7F5EF] p-4 rounded-lg text-center">
                                          <div className="text-2xl font-bold text-[#0E161B]">{selectedItem.currentStock}</div>
                                          <div className="text-sm text-[#5F3C18]/60">Current</div>
                                        </div>
                                        <div className="bg-[#F7F5EF] p-4 rounded-lg text-center">
                                          <div className="text-2xl font-bold text-[#0E161B]">{selectedItem.availableStock}</div>
                                          <div className="text-sm text-[#5F3C18]/60">Available</div>
                                        </div>
                                        <div className="bg-[#F7F5EF] p-4 rounded-lg text-center">
                                          <div className="text-2xl font-bold text-[#0E161B]">{selectedItem.reservedStock}</div>
                                          <div className="text-sm text-[#5F3C18]/60">Reserved</div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Stock Adjustment */}
                                    <div>
                                      <h4 className="font-semibold mb-2">Adjust Stock</h4>
                                      <div className="space-y-4">
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            onClick={() => setAdjustmentAmount((prev) => prev - 1)}
                                            disabled={updating}
                                          >
                                            <Minus className="h-4 w-4" />
                                          </Button>
                                          <Input
                                            type="number"
                                            value={adjustmentAmount}
                                            onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                                            className="text-center"
                                            disabled={updating}
                                          />
                                          <Button
                                            variant="outline"
                                            onClick={() => setAdjustmentAmount((prev) => prev + 1)}
                                            disabled={updating}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </div>
                                        <div>
                                          <Label>Reason</Label>
                                          <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select reason" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {adjustmentReasons.map((reason) => (
                                                <SelectItem key={reason} value={reason}>
                                                  {getReasonLabel(reason)}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <Label>Notes (Optional)</Label>
                                          <Input
                                            value={adjustmentNotes}
                                            onChange={(e) => setAdjustmentNotes(e.target.value)}
                                            placeholder="Add notes..."
                                            disabled={updating}
                                          />
                                        </div>
                                        <Button
                                          onClick={() => adjustStock(selectedItem.variantId)}
                                          disabled={updating || !adjustmentReason}
                                          className="w-full"
                                        >
                                          {adjustmentAmount > 0 ? (
                                            <>
                                              <TrendingUp className="h-4 w-4 mr-2" />
                                              Add Stock
                                            </>
                                          ) : (
                                            <>
                                              <TrendingDown className="h-4 w-4 mr-2" />
                                              Remove Stock
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>

                                    {/* Movement History */}
                                    <div>
                                      <h4 className="font-semibold mb-2">Recent Movements</h4>
                                      {selectedItem.movements.length === 0 ? (
                                        <div className="bg-[#F7F5EF] p-4 rounded-lg text-center text-[#5F3C18]/60">
                                          No movements recorded
                                        </div>
                                      ) : (
                                        <div className="space-y-2">
                                          {selectedItem.movements.map((movement) => (
                                            <div key={movement.id} className="bg-[#F7F5EF] p-4 rounded-lg">
                                              <div className="flex justify-between items-start mb-2">
                                                <div>
                                                  <div className="font-medium text-[#0E161B]">
                                                    {getReasonLabel(movement.reason)}
                                                  </div>
                                                  {movement.notes && (
                                                    <div className="text-sm text-[#5F3C18]/60">{movement.notes}</div>
                                                  )}
                                                </div>
                                                <div className={`font-semibold ${movement.difference > 0 ? "text-green-600" : "text-red-600"}`}>
                                                  {movement.difference > 0 ? "+" : ""}{movement.difference}
                                                </div>
                                              </div>
                                              <div className="text-xs text-[#5F3C18]/60">
                                                {movement.previousStock} → {movement.newStock}
                                              </div>
                                              <div className="text-xs text-[#5F3C18]/60">
                                                {new Date(movement.createdAt).toLocaleString()}
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
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
