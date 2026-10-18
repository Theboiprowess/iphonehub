"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Plus,
  Smartphone,
  Package,
  Edit,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  MoreHorizontal,
  Loader2,
  Copy,
  Check
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminCard } from "@/components/admin/admin-card";
import { StatCard } from "@/components/admin/stat-card";
import { SearchToolbar } from "@/components/admin/search-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { ResponsiveGrid } from "@/components/admin/responsive-grid";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [search, status, condition, category, sortBy, sortOrder, page]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (condition) params.append("condition", condition);
      if (category) params.append("category", category);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortOrder) params.append("sortOrder", sortOrder);
      params.append("page", page.toString());
      params.append("limit", "50");

      const response = await fetch(`/admin/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (search && !product.name?.toLowerCase().includes(search.toLowerCase()) &&
        !product.model?.toLowerCase().includes(search.toLowerCase()) &&
        !product.slug?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (status && product.status !== status) return false;
    if (condition && product.condition !== condition) return false;
    if (category && product.categoryId !== category) return false;
    return true;
  });

  const statusCounts = {
    DRAFT: products.filter(p => p.status === "DRAFT").length,
    PUBLISHED: products.filter(p => p.status === "PUBLISHED").length,
    HIDDEN: products.filter(p => p.status === "HIDDEN").length,
    OUT_OF_STOCK: products.filter(p => p.status === "OUT_OF_STOCK").length,
    SOLD: products.filter(p => p.status === "SOLD").length,
    ARCHIVED: products.filter(p => p.status === "ARCHIVED").length,
  };

  const conditionCounts = {
    BOXED: products.filter(p => p.condition === "BOXED").length,
    PRE_OWNED: products.filter(p => p.condition === "PRE_OWNED").length,
    SECOND_HAND: products.filter(p => p.condition === "SECOND_HAND").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800 border-gray-200";
      case "PUBLISHED": return "bg-green-100 text-green-800 border-green-200";
      case "HIDDEN": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OUT_OF_STOCK": return "bg-red-100 text-red-800 border-red-200";
      case "SOLD": return "bg-purple-100 text-purple-800 border-purple-200";
      case "ARCHIVED": return "bg-gray-200 text-gray-600 border-gray-300";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "BOXED": return "bg-[#CDB586] text-[#0E161B] border border-[#0E161B]";
      case "PRE_OWNED": return "bg-[#81592B] text-[#EBE2C5] border border-[#EBE2C5]";
      case "SECOND_HAND": return "bg-[#5F3C18] text-[#EBE2C5] border border-[#EBE2C5]";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedProducts.size === 0) return;

    setActionLoading(true);
    try {
      const response = await fetch("/admin/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          productIds: Array.from(selectedProducts)
        })
      });

      if (!response.ok) {
        throw new Error("Failed to perform bulk action");
      }

      setSelectedProducts(new Set());
      fetchProducts();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      alert("Failed to perform bulk action");
    } finally {
      setActionLoading(false);
    }
  };

  const handleProductAction = async (productId: string, action: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/admin/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error("Failed to perform action");
      }

      fetchProducts();
    } catch (error) {
      console.error("Error performing action:", error);
      alert("Failed to perform action");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const productsWithStock = filteredProducts.map(product => {
    const totalStock = product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;
    const minPrice = product.variants?.length > 0 
      ? Math.min(...product.variants.map((v: any) => Number(v.price)))
      : 0;
    const maxPrice = product.variants?.length > 0 
      ? Math.max(...product.variants.map((v: any) => Number(v.price)))
      : 0;
    
    return {
      ...product,
      totalStock,
      minPrice,
      maxPrice
    };
  });

  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container text-center">
        <AdminPageHeader 
          title="Products"
          subtitle="Manage your product catalogue"
          actionHref="/admin/products/new"
          actionText="Add Product"
        />

      {/* Quick Stats */}
      <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 4 }}>
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          color="#CDB586"
        />
        <StatCard
          title="Published"
          value={statusCounts.PUBLISHED}
          icon={Smartphone}
          color="#CDB586"
        />
        <StatCard
          title="Draft"
          value={statusCounts.DRAFT}
          icon={Edit}
          color="#CDB586"
        />
        <StatCard
          title="Out of Stock"
          value={statusCounts.OUT_OF_STOCK}
          icon={Archive}
          color="#CDB586"
        />
      </ResponsiveGrid>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
        </div>
      ) : error ? (
        <AdminCard>
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchProducts} variant="outline">
              Retry
            </Button>
          </div>
        </AdminCard>
      ) : (
        <AdminCard>
          <EmptyState
            icon={Package}
            title="Products functionality loaded"
            description="Product management features are ready to use"
          />
        </AdminCard>
      )}
    </div>
    </AdminPageContainer>
  );
}