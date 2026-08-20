"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminCard } from "@/components/admin/admin-card";
import { EmptyState } from "@/components/admin/empty-state";
import { Plus, Edit, Trash2, Image as ImageIcon, Package, DollarSign, Check, X } from "lucide-react";

interface Accessory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  stock: number;
  imageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  compatibility?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "OTHER",
    price: "",
    comparePrice: "",
    costPrice: "",
    sku: "",
    stock: "0",
    imageUrl: "",
    isFeatured: false,
    isActive: true,
    compatibility: "",
    status: "DRAFT"
  });

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const response = await fetch("/admin/api/accessories");
      const data = await response.json();
      
      if (!response.ok) {
        console.error("API error:", data.error);
        if (data.migrationRequired) {
          setError(data.error);
        } else {
          setError(data.error || "Failed to load accessories");
        }
      }
      
      setAccessories(data.accessories || []);
    } catch (error) {
      console.error("Error fetching accessories:", error);
      setError("Failed to load accessories. Please check if the database migration has been applied.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingAccessory 
        ? `/admin/api/accessories/${editingAccessory.id}`
        : "/admin/api/accessories";
      
      const method = editingAccessory ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
          stock: parseInt(formData.stock),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowForm(false);
        setEditingAccessory(null);
        resetForm();
        fetchAccessories();
      } else {
        console.error("Error saving accessory:", data.error);
        alert(`Failed to save accessory: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving accessory:", error);
      alert("Failed to save accessory. Please try again.");
    }
  };

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      name: accessory.name,
      description: accessory.description || "",
      category: accessory.category,
      price: accessory.price.toString(),
      comparePrice: accessory.comparePrice?.toString() || "",
      costPrice: accessory.costPrice?.toString() || "",
      sku: accessory.sku || "",
      stock: accessory.stock.toString(),
      imageUrl: accessory.imageUrl || "",
      isFeatured: accessory.isFeatured,
      isActive: accessory.isActive,
      compatibility: accessory.compatibility || "",
      status: accessory.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this accessory?")) return;
    
    try {
      const response = await fetch(`/admin/api/accessories/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchAccessories();
      }
    } catch (error) {
      console.error("Error deleting accessory:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "OTHER",
      price: "",
      comparePrice: "",
      costPrice: "",
      sku: "",
      stock: "0",
      imageUrl: "",
      isFeatured: false,
      isActive: true,
      compatibility: "",
      status: "DRAFT"
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAccessory(null);
    resetForm();
  };

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="space-y-8 admin-page-container text-center">
          <AdminPageHeader title="Accessories" subtitle="Manage accessories inventory" />
          <AdminCard>
            <div className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40 animate-pulse" />
              <p className="font-medium text-[#5F3C18]">Loading accessories...</p>
            </div>
          </AdminCard>
        </div>
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <div className="space-y-8 admin-page-container text-center">
          <AdminPageHeader title="Accessories" subtitle="Manage accessories inventory" />
          <AdminCard className="bg-red-50 border-red-200">
            <div className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-red-400" />
              <h3 className="font-semibold text-red-800 mb-2">Error Loading Accessories</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchAccessories} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                Try Again
              </Button>
            </div>
          </AdminCard>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container text-center">
        <AdminPageHeader title="Accessories" subtitle="Manage accessories inventory" />

      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <div className="text-sm text-[#5F3C18]">
              {accessories.length} accessories found
            </div>
            <Button onClick={() => setShowForm(true)} className="gold-glow">
              <Plus className="h-4 w-4 mr-2" />
              Add Accessory
            </Button>
          </div>

          {accessories.length === 0 ? (
            <AdminCard>
              <EmptyState
                icon={Package}
                title="No accessories found"
                description="Start building your accessories inventory by adding your first item"
                actions={
                  <Button onClick={() => setShowForm(true)} className="gold-glow">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Accessory
                  </Button>
                }
              />
            </AdminCard>
          ) : (
            <div className="grid gap-4">
              {accessories.map((accessory) => (
                <AdminCard key={accessory.id}>
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {accessory.imageUrl ? (
                          <img
                            src={accessory.imageUrl}
                            alt={accessory.name}
                            className="w-16 h-16 object-cover rounded-lg border border-[#CDB586]/30"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-[#CDB586]/10 rounded-lg border border-[#CDB586]/30 flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-[#CDB586]/40" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#0E161B]">{accessory.name}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              accessory.status === 'PUBLISHED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {accessory.status}
                            </span>
                            {accessory.isFeatured && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-[#CDB586]/20 text-[#CDB586]">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#5F3C18] mb-2">{accessory.category}</p>
                          {accessory.description && (
                            <p className="text-sm text-[#5F3C18]/70 line-clamp-2">{accessory.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-[#0E161B] font-semibold">${accessory.price.toFixed(2)}</span>
                            {accessory.comparePrice && (
                              <span className="text-[#5F3C18]/50 line-through">${accessory.comparePrice.toFixed(2)}</span>
                            )}
                            <span className="text-[#5F3C18]/70">Stock: {accessory.stock}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(accessory)}
                          className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(accessory.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </AdminCard>
              ))}
            </div>
          )}
        </>
      ) : (
        <AdminCard title={editingAccessory ? "Edit Accessory" : "Add New Accessory"}>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-white border-[#CDB586]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHARGERS">Chargers</SelectItem>
                      <SelectItem value="CABLES">Cables</SelectItem>
                      <SelectItem value="CASES">Cases</SelectItem>
                      <SelectItem value="SCREEN_PROTECTORS">Screen Protectors</SelectItem>
                      <SelectItem value="HEADPHONES">Headphones</SelectItem>
                      <SelectItem value="SPEAKERS">Speakers</SelectItem>
                      <SelectItem value="POWER_BANKS">Power Banks</SelectItem>
                      <SelectItem value="ADAPTERS">Adapters</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price ($)</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price ($)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="bg-white border-[#CDB586]/30"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="bg-white border-[#CDB586]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compatibility">Compatibility</Label>
                <Input
                  id="compatibility"
                  value={formData.compatibility}
                  onChange={(e) => setFormData({ ...formData, compatibility: e.target.value })}
                  placeholder="e.g., iPhone 12, iPhone 13, iPhone 14"
                  className="bg-white border-[#CDB586]/30"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="bg-white border-[#CDB586]/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="HIDDEN">Hidden</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">Featured</Label>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">Active</Label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="gold-glow">
                  {editingAccessory ? "Update Accessory" : "Add Accessory"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </AdminCard>
      )}
    </div>
    </AdminPageContainer>
  );
}
