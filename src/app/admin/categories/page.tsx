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
  ArrowUp,
  ArrowDown,
  Tag
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/admin/api/categories");
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCategories = async () => {
    try {
      const response = await fetch("/admin/api/categories/seed", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to seed categories");
      }

      const data = await response.json();
      alert(`Categories seeded successfully! Created ${data.categories.length} categories.`);
      fetchCategories();
    } catch (error) {
      console.error("Error seeding categories:", error);
      alert("Failed to seed categories");
    }
  };

  const handleSave = async (categoryData: Partial<Category>) => {
    try {
      const url = editingCategory ? "/admin/api/categories" : "/admin/api/categories";
      const method = editingCategory ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory ? { ...categoryData, id: editingCategory.id } : categoryData),
      });

      if (!response.ok) {
        throw new Error("Failed to save category");
      }

      setDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This will affect all products in this category.")) return;

    try {
      const response = await fetch(`/admin/api/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category");
    }
  };

  const moveCategoryOrder = (index: number, direction: "up" | "down") => {
    const newCategories = [...categories];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newCategories.length) {
      [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
      setCategories(newCategories);
      
      // Update order in database
      newCategories.forEach((category, i) => {
        fetch("/admin/api/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: category.id, order: i }),
        });
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="space-y-2 min-w-0 flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope">Categories</h1>
          <p className="text-[#5F3C18] text-base">Manage product categories</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          <Button
            onClick={handleSeedCategories}
            variant="outline"
            className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 flex-shrink-0"
          >
            Seed Default
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#F7F5EF] border-[#CDB586]">
              <DialogHeader>
                <DialogTitle className="text-[#0E161B]">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={editingCategory}
                onSave={handleSave}
                onCancel={() => {
                  setDialogOpen(false);
                  setEditingCategory(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-12 text-center">
            <Tag className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium text-[#5F3C18] mb-2">No categories yet</p>
            <p className="text-[#5F3C18]/60 mb-4">Create your first category to organize your products</p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Category List */}
      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <Card key={category.id} className="bg-[#F7F5EF] border-[#CDB586]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0E161B] mb-1">{category.name}</h3>
                    <p className="text-sm text-[#5F3C18]/60">/{category.slug}</p>
                  </div>
                  <Badge className="bg-[#CDB586] text-[#0E161B]">Order: {category.order}</Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-[#5F3C18]/60 mb-3 line-clamp-2">{category.description}</p>
                )}
                {category.image && (
                  <div className="mb-3">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-24 object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveCategoryOrder(index, "up")}
                    disabled={index === 0}
                    className="hover:bg-[#CDB586]/20 flex-shrink-0"
                  >
                    <ArrowUp className="h-4 w-4 text-[#5F3C18]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveCategoryOrder(index, "down")}
                    disabled={index === categories.length - 1}
                    className="hover:bg-[#CDB586]/20 flex-shrink-0"
                  >
                    <ArrowDown className="h-4 w-4 text-[#5F3C18]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingCategory(category);
                      setDialogOpen(true);
                    }}
                    className="hover:bg-[#CDB586]/20 flex-shrink-0"
                  >
                    <Edit className="h-4 w-4 text-[#5F3C18]" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(category.id)}
                    className="hover:bg-red-100 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryForm({ category, onSave, onCancel }: { category: Category | null; onSave: (category: Partial<Category>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<Category>>(
    category || {
      name: "",
      slug: "",
      description: "",
      image: "",
      order: 0
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="bg-white border-[#CDB586]"
          required
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image || ""}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="/uploads/media/category-image.jpg"
          className="bg-white border-[#CDB586]"
        />
      </div>
      <div>
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          className="bg-white border-[#CDB586]"
        />
      </div>
      <div className="flex gap-2 justify-end">
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
          Save Category
        </Button>
      </div>
    </form>
  );
}
