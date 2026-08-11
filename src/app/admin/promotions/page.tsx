"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2,
  Search,
  Filter,
  Tag,
  Calendar,
  Percent,
  DollarSign,
  Code,
  Zap,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

interface Promotion {
  id: string;
  name: string;
  description?: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "SALE_PRICE" | "PROMO_CODE" | "FLASH_SALE";
  value: number;
  promoCode?: string;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    model: string;
  };
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });

  useEffect(() => {
    fetchPromotions();
  }, [searchQuery, statusFilter, typeFilter, pagination.page]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);

      const response = await fetch(`/admin/api/promotions?${params}`);
      const data = await response.json();
      
      setPromotions(data.promotions || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (promotionData: Partial<Promotion>) => {
    try {
      const url = "/admin/api/promotions";
      const method = editingPromotion ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPromotion ? { ...promotionData, id: editingPromotion.id } : promotionData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save promotion");
      }

      setDialogOpen(false);
      setEditingPromotion(null);
      fetchPromotions();
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert(error instanceof Error ? error.message : "Failed to save promotion");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;

    try {
      const response = await fetch(`/admin/api/promotions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete promotion");
      }

      fetchPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      alert(error instanceof Error ? error.message : "Failed to delete promotion");
    }
  };

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      const response = await fetch("/admin/api/promotions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: promotion.id,
          isActive: !promotion.isActive
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update promotion status");
      }

      fetchPromotions();
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      alert("Failed to update promotion status");
    }
  };

  const getPromotionTypeIcon = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return <Percent className="h-4 w-4" />;
      case "FIXED_AMOUNT":
        return <DollarSign className="h-4 w-4" />;
      case "SALE_PRICE":
        return <Tag className="h-4 w-4" />;
      case "PROMO_CODE":
        return <Code className="h-4 w-4" />;
      case "FLASH_SALE":
        return <Zap className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return "Percentage";
      case "FIXED_AMOUNT":
        return "Fixed Amount";
      case "SALE_PRICE":
        return "Sale Price";
      case "PROMO_CODE":
        return "Promo Code";
      case "FLASH_SALE":
        return "Flash Sale";
      default:
        return type;
    }
  };

  const isExpired = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const getUsageBadge = (usageCount: number, usageLimit?: number) => {
    if (!usageLimit) {
      return <Badge variant="outline">{usageCount} used</Badge>;
    }
    const percentage = (usageCount / usageLimit) * 100;
    const color = percentage >= 90 ? "destructive" : percentage >= 70 ? "default" : "secondary";
    return <Badge variant={color}>{usageCount}/{usageLimit} used</Badge>;
  };

  if (loading && promotions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Promotions" subtitle="Manage promotions and discounts" />

      {/* Filters and Search */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5F3C18]/60" />
              <Input
                placeholder="Search promotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border-[#CDB586] pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white border-[#CDB586] w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white border-[#CDB586] w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                <SelectItem value="SALE_PRICE">Sale Price</SelectItem>
                <SelectItem value="PROMO_CODE">Promo Code</SelectItem>
                <SelectItem value="FLASH_SALE">Flash Sale</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Promotion
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#F7F5EF] border-[#CDB586] max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-[#0E161B]">
                    {editingPromotion ? "Edit Promotion" : "Add Promotion"}
                  </DialogTitle>
                </DialogHeader>
                <PromotionForm
                  promotion={editingPromotion}
                  onSave={handleSave}
                  onCancel={() => {
                    setDialogOpen(false);
                    setEditingPromotion(null);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {!loading && promotions.length === 0 && (
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-12 text-center">
            <Tag className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium text-[#5F3C18] mb-2">No promotions found</p>
            <p className="text-[#5F3C18]/60 mb-4">Create your first promotion to offer discounts</p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Promotion
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Promotions List */}
      {promotions.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className="bg-[#F7F5EF] border-[#CDB586]">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Main Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-[#0E161B] text-lg">{promotion.name}</h3>
                          <Badge variant={promotion.isActive && !isExpired(promotion.endDate) ? "default" : "secondary"} className="bg-[#CDB586] text-[#0E161B]">
                            {getPromotionTypeIcon(promotion.type)}
                            <span className="ml-1">{getPromotionTypeLabel(promotion.type)}</span>
                          </Badge>
                          {promotion.isActive ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-300 text-red-600">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                          {isExpired(promotion.endDate) && (
                            <Badge variant="destructive">
                              <Clock className="h-3 w-3 mr-1" />
                              Expired
                            </Badge>
                          )}
                        </div>
                        {promotion.description && (
                          <p className="text-sm text-[#5F3C18]/70 mb-2">{promotion.description}</p>
                        )}
                        {promotion.promoCode && (
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="h-4 w-4 text-[#CDB586]" />
                            <span className="font-mono bg-[#CDB586]/20 px-2 py-1 rounded text-sm">
                              {promotion.promoCode}
                            </span>
                          </div>
                        )}
                        {promotion.product && (
                          <div className="text-sm text-[#5F3C18]/60">
                            Product: {promotion.product.name} ({promotion.product.model})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Discount Value */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-[#0E161B] font-medium">
                        {promotion.type === "PERCENTAGE" ? (
                          <>
                            <Percent className="h-4 w-4 text-[#CDB586]" />
                            <span>{promotion.value}% off</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-[#CDB586]" />
                            <span>${promotion.value} off</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[#5F3C18]/60">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(promotion.startDate).toLocaleDateString()} - {new Date(promotion.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Usage */}
                    <div className="flex items-center gap-2">
                      {getUsageBadge(promotion.usageCount, promotion.usageLimit)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <Switch
                        checked={promotion.isActive}
                        onCheckedChange={() => handleToggleActive(promotion)}
                        disabled={isExpired(promotion.endDate)}
                      />
                      <span className="text-sm text-[#5F3C18]/60">
                        {promotion.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingPromotion(promotion);
                          setDialogOpen(true);
                        }}
                        className="hover:bg-[#CDB586]/20"
                      >
                        <Edit className="h-4 w-4 text-[#5F3C18]" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(promotion.id)}
                        disabled={promotion.usageCount > 0}
                        className="hover:bg-red-100 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="border-[#CDB586] text-[#0E161B]"
          >
            Previous
          </Button>
          <span className="text-sm text-[#5F3C18]/60">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.totalPages}
            className="border-[#CDB586] text-[#0E161B]"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function PromotionForm({ 
  promotion, 
  onSave, 
  onCancel 
}: { 
  promotion: Promotion | null; 
  onSave: (promotion: Partial<Promotion>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<Promotion>>(
    promotion || {
      name: "",
      description: "",
      type: "PERCENTAGE",
      value: 0,
      promoCode: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: null,
      isActive: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Promotion Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-white border-[#CDB586]"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="type">Promotion Type *</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as any })}
        >
          <SelectTrigger className="bg-white border-[#CDB586]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">Percentage Discount</SelectItem>
            <SelectItem value="FIXED_AMOUNT">Fixed Amount Discount</SelectItem>
            <SelectItem value="SALE_PRICE">Sale Price</SelectItem>
            <SelectItem value="PROMO_CODE">Promo Code</SelectItem>
            <SelectItem value="FLASH_SALE">Flash Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="value">
          {formData.type === "PERCENTAGE" ? "Discount Percentage *" : "Discount Amount *"}
        </Label>
        <Input
          id="value"
          type="number"
          step="0.01"
          min="0"
          max={formData.type === "PERCENTAGE" ? 100 : undefined}
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
          className="bg-white border-[#CDB586]"
          required
        />
        <p className="text-xs text-[#5F3C18]/60 mt-1">
          {formData.type === "PERCENTAGE" ? "Enter percentage (0-100)" : "Enter amount in USD"}
        </p>
      </div>

      <div>
        <Label htmlFor="promoCode">Promo Code (optional)</Label>
        <Input
          id="promoCode"
          value={formData.promoCode || ""}
          onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase() })}
          className="bg-white border-[#CDB586]"
          placeholder="e.g., SUMMER2024"
        />
        <p className="text-xs text-[#5F3C18]/60 mt-1">Required for PROMO_CODE type</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate?.split('T')[0]}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="bg-white border-[#CDB586]"
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate?.split('T')[0]}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="bg-white border-[#CDB586]"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="usageLimit">Usage Limit (optional)</Label>
        <Input
          id="usageLimit"
          type="number"
          min="1"
          value={formData.usageLimit || ""}
          onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
          className="bg-white border-[#CDB586]"
          placeholder="Leave empty for unlimited"
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-[#CDB586] text-[#0E161B]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
        >
          {promotion ? "Update Promotion" : "Create Promotion"}
        </Button>
      </div>
    </form>
  );
}
