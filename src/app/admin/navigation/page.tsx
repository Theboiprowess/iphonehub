"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Search,
  Eye,
  EyeOff,
  AlertCircle
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


interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isExternal: boolean;
  isActive: boolean;
  parentId: string | null;
  parent?: {
    id: string;
    label: string;
  };
  children?: NavigationItem[];
  createdAt: string;
  updatedAt: string;
}

interface NavigationItemFlat extends NavigationItem {
  children?: never;
}

export default function NavigationPage() {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const [flatItems, setFlatItems] = useState<NavigationItemFlat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNavigationItems();
  }, []);

  const fetchNavigationItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const [treeResponse, flatResponse] = await Promise.all([
        fetch("/admin/api/navigation"),
        fetch("/admin/api/navigation?flat=true")
      ]);

      if (!treeResponse.ok || !flatResponse.ok) {
        throw new Error("Failed to fetch navigation items");
      }

      const treeData = await treeResponse.json();
      const flatData = await flatResponse.json();

      setNavigationItems(treeData || []);
      setFlatItems(flatData || []);
    } catch (error) {
      console.error("Error fetching navigation items:", error);
      setError("Failed to load navigation items");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (itemData: Partial<NavigationItem>) => {
    try {
      const url = "/admin/api/navigation";
      const method = editingItem ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem ? { ...itemData, id: editingItem.id } : itemData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save navigation item");
      }

      setDialogOpen(false);
      setEditingItem(null);
      fetchNavigationItems();
    } catch (error) {
      console.error("Error saving navigation item:", error);
      alert(error instanceof Error ? error.message : "Failed to save navigation item");
    }
  };

  const handleDelete = async (id: string, hasChildren: boolean = false) => {
    if (hasChildren) {
      alert("Cannot delete navigation item with child items. Please delete or reassign children first.");
      return;
    }

    if (!confirm("Are you sure you want to delete this navigation item?")) return;

    try {
      const response = await fetch(`/admin/api/navigation?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete navigation item");
      }

      fetchNavigationItems();
    } catch (error) {
      console.error("Error deleting navigation item:", error);
      alert(error instanceof Error ? error.message : "Failed to delete navigation item");
    }
  };

  const handleToggleVisibility = async (item: NavigationItem) => {
    try {
      const response = await fetch("/admin/api/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          isActive: !item.isActive
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update visibility");
      }

      fetchNavigationItems();
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility");
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredItems = searchQuery
    ? flatItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : flatItems;

  const moveItemOrder = async (item: NavigationItem, direction: "up" | "down") => {
    const siblings = item.parentId
      ? flatItems.filter(i => i.parentId === item.parentId)
      : flatItems.filter(i => i.parentId === null);
    
    const currentIndex = siblings.findIndex(i => i.id === item.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= siblings.length) return;

    const targetItem = siblings[newIndex];
    
    // Swap orders
    try {
      await Promise.all([
        fetch("/admin/api/navigation", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, order: targetItem.order }),
        }),
        fetch("/admin/api/navigation", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: targetItem.id, order: item.order }),
        }),
      ]);

      fetchNavigationItems();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order");
    }
  };

  const handleSeedNavigation = async () => {
    try {
      const response = await fetch("/admin/api/navigation/seed", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to seed navigation");
      }

      const data = await response.json();
      alert(`Navigation seeded successfully! Created ${data.count} items.`);
      fetchNavigationItems();
    } catch (error) {
      console.error("Error seeding navigation:", error);
      alert(error instanceof Error ? error.message : "Failed to seed navigation");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="space-y-2 min-w-0 flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope">Navigation</h1>
            <p className="text-[#5F3C18] text-base">Manage website navigation menu</p>
          </div>
        </div>
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <p className="font-medium text-red-800 mb-2">Error loading navigation</p>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchNavigationItems} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="space-y-2 min-w-0 flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#0E161B] font-manrope">Navigation</h1>
          <p className="text-[#5F3C18] text-base">Manage website navigation menu</p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-3">
          {flatItems.length === 0 && (
            <Button
              onClick={handleSeedNavigation}
              variant="outline"
              className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 flex-shrink-0"
            >
              Seed Default
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] flex-shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Add Navigation Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#F7F5EF] border-[#CDB586] max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[#0E161B]">
                  {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
                </DialogTitle>
              </DialogHeader>
              <NavigationForm
                item={editingItem}
                allItems={flatItems}
                onSave={handleSave}
                onCancel={() => {
                  setDialogOpen(false);
                  setEditingItem(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#5F3C18]/40" />
        <Input
          placeholder="Search navigation items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-white border-[#CDB586] pl-10"
        />
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium text-[#5F3C18] mb-2">
              {searchQuery ? "No navigation items found" : "No navigation items yet"}
            </p>
            <p className="text-[#5F3C18]/60 mb-4">
              {searchQuery ? "Try a different search term" : "Create your first navigation item"}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Navigation Item
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation Tree/List */}
      {filteredItems.length > 0 && (
        <div className="space-y-2">
          {(searchQuery ? filteredItems : navigationItems).map((item) => (
            <NavigationItemCard
              key={item.id}
              item={item}
              allItems={flatItems}
              isExpanded={expandedItems.has(item.id)}
              onToggleExpand={() => toggleExpanded(item.id)}
              onEdit={(item) => {
                setEditingItem(item);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
              onMoveOrder={moveItemOrder}
              isSearchMode={!!searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationItemCard({
  item,
  allItems,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMoveOrder,
  isSearchMode,
  level = 0
}: {
  item: NavigationItem;
  allItems: NavigationItemFlat[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (item: NavigationItem) => void;
  onDelete: (id: string, hasChildren: boolean) => void;
  onToggleVisibility: (item: NavigationItem) => void;
  onMoveOrder: (item: NavigationItem, direction: "up" | "down") => void;
  isSearchMode: boolean;
  level?: number;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const canMoveUp = level > 0 || (item.parentId === null && allItems.filter(i => i.parentId === null).findIndex(i => i.id === item.id) > 0);
  const canMoveDown = hasChildren ? false : true; // Simplified for now

  return (
    <div className="space-y-2">
      <Card className={`bg-[#F7F5EF] border-[#CDB586] ${!item.isActive ? 'opacity-60' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Expand/Collapse Button */}
            {hasChildren && !isSearchMode && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleExpand}
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-[#5F3C18]" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-[#5F3C18]" />
                )}
              </Button>
            )}
            
            {/* Item Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0E161B] truncate">{item.label}</span>
                {item.isExternal && (
                  <ExternalLink className="h-3 w-3 text-[#5F3C18]/60 flex-shrink-0" />
                )}
                <Badge variant={item.isActive ? "default" : "secondary"} className="bg-[#CDB586] text-[#0E161B] flex-shrink-0">
                  {item.isActive ? "Active" : "Hidden"}
                </Badge>
              </div>
              <p className="text-sm text-[#5F3C18]/60 truncate">{item.url}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleVisibility(item)}
                className="h-8 w-8 p-0"
                title={item.isActive ? "Hide" : "Show"}
              >
                {item.isActive ? (
                  <Eye className="h-4 w-4 text-[#5F3C18]" />
                ) : (
                  <EyeOff className="h-4 w-4 text-[#5F3C18]/60" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveOrder(item, "up")}
                disabled={!canMoveUp}
                className="h-8 w-8 p-0"
                title="Move Up"
              >
                <ArrowUp className="h-4 w-4 text-[#5F3C18]" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMoveOrder(item, "down")}
                disabled={hasChildren}
                className="h-8 w-8 p-0"
                title="Move Down"
              >
                <ArrowDown className="h-4 w-4 text-[#5F3C18]" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(item)}
                className="h-8 w-8 p-0"
                title="Edit"
              >
                <Edit className="h-4 w-4 text-[#5F3C18]" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(item.id, hasChildren)}
                disabled={hasChildren}
                className="h-8 w-8 p-0"
                title={hasChildren ? "Cannot delete (has children)" : "Delete"}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      {hasChildren && isExpanded && !isSearchMode && (
        <div className="ml-6 space-y-2">
          {item.children?.map((child) => (
            <NavigationItemCard
              key={child.id}
              item={child}
              allItems={allItems}
              isExpanded={false}
              onToggleExpand={() => {}}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleVisibility={onToggleVisibility}
              onMoveOrder={onMoveOrder}
              isSearchMode={false}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationForm({
  item,
  allItems,
  onSave,
  onCancel
}: {
  item: NavigationItem | null;
  allItems: NavigationItemFlat[];
  onSave: (item: Partial<NavigationItem>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<NavigationItem>>(
    item || {
      label: "",
      url: "",
      order: 0,
      isExternal: false,
      isActive: true,
      parentId: null
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    try {
      if (formData.url && !formData.url.startsWith('/')) {
        new URL(formData.url);
      }
    } catch {
      alert("Please enter a valid URL (e.g., /about or https://example.com)");
      return;
    }

    onSave(formData);
  };

  // Filter out current item and its descendants from parent options
  const availableParents = allItems.filter(parent => {
    if (!item) return true;
    if (parent.id === item.id) return false;
    // Simple check - in production you'd want to check for circular references
    return true;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="label">Label *</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
          placeholder="e.g., Products"
        />
      </div>
      <div>
        <Label htmlFor="url">URL *</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          className="bg-white border-[#CDB586]"
          required
          placeholder="e.g., /products or https://example.com"
        />
        <p className="text-xs text-[#5F3C18]/60 mt-1">
          Use / for internal links or full URL for external links
        </p>
      </div>
      <div>
        <Label htmlFor="parent">Parent Item</Label>
        <Select
          value={formData.parentId || "none"}
          onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? null : value })}
        >
          <SelectTrigger className="bg-white border-[#CDB586]">
            <SelectValue placeholder="No parent (top-level)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No parent (top-level)</SelectItem>
            {availableParents.map((parent) => (
              <SelectItem key={parent.id} value={parent.id}>
                {parent.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
          className="bg-white border-[#CDB586]"
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="isExternal"
          checked={formData.isExternal}
          onCheckedChange={(checked) => setFormData({ ...formData, isExternal: checked })}
        />
        <Label htmlFor="isExternal" className="cursor-pointer">
          External Link (opens in new tab)
        </Label>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Visible in navigation
        </Label>
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
          {item ? "Update" : "Create"} Navigation Item
        </Button>
      </div>
    </form>
  );
}
