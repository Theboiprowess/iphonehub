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

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
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

  // Calculate aggregate stock for each product
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Products</h1>
          <p className="text-[#EBE2C5]/60">Manage your product catalogue</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]">Total Products</p>
                <p className="text-2xl font-bold text-[#0E161B]">{products.length}</p>
              </div>
              <Package className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]">Published</p>
                <p className="text-2xl font-bold text-[#0E161B]">
                  {statusCounts.PUBLISHED}
                </p>
              </div>
              <Smartphone className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]">Out of Stock</p>
                <p className="text-2xl font-bold text-[#0E161B]">
                  {statusCounts.OUT_OF_STOCK}
                </p>
              </div>
              <Archive className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5F3C18]">Total Stock</p>
                <p className="text-2xl font-bold text-[#0E161B]">
                  {productsWithStock.reduce((sum, p) => sum + p.totalStock, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-[#CDB586]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#F7F5EF] border-[#CDB586]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-[#EBE2C5] border-[#CDB586]/30"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 bg-[#EBE2C5] border-[#CDB586]/30 rounded-md text-[#0E161B]"
              >
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="HIDDEN">Hidden</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
                <option value="SOLD">Sold</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="px-4 py-2 bg-[#EBE2C5] border-[#CDB586]/30 rounded-md text-[#0E161B]"
              >
                <option value="">All Conditions</option>
                <option value="BOXED">Boxed</option>
                <option value="PRE_OWNED">Pre-Owned</option>
                <option value="SECOND_HAND">Second Hand</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-[#EBE2C5] border-[#CDB586]/30 rounded-md text-[#0E161B]"
              >
                <option value="createdAt">Date</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="stock">Stock</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 bg-[#EBE2C5] border-[#CDB586]/30 rounded-md text-[#0E161B]"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
          
          {/* Bulk Actions */}
          {selectedProducts.size > 0 && (
            <div className="mt-4 pt-4 border-t border-[#CDB586]/30 flex items-center gap-2">
              <span className="text-sm text-[#5F3C18]">
                {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("PUBLISH")}
                  disabled={actionLoading}
                  className="border-[#CDB586] text-[#CDB586]"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Eye className="h-4 w-4 mr-1" />}
                  Publish
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("HIDE")}
                  disabled={actionLoading}
                  className="border-[#CDB586] text-[#CDB586]"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <EyeOff className="h-4 w-4 mr-1" />}
                  Hide
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("ARCHIVE")}
                  disabled={actionLoading}
                  className="border-[#CDB586] text-[#CDB586]"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Archive className="h-4 w-4 mr-1" />}
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("DELETE")}
                  disabled={actionLoading}
                  className="border-red-500 text-red-500 hover:bg-red-50"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1" />}
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-[#CDB586]" />
            <p className="mt-4 text-[#5F3C18]">Loading products...</p>
          </CardContent>
        </Card>
      ) : productsWithStock.length === 0 ? (
        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="text-center py-12 text-[#5F3C18]">
            <Smartphone className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium">No products found</p>
            <p className="text-sm">Create your first product to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsWithStock.map((product) => (
            <Card key={product.id} className="bg-[#F7F5EF] border-[#CDB586] hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-[#EBE2C5] relative">
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => toggleProductSelection(product.id)}
                  className="absolute top-2 left-2 w-4 h-4 z-10"
                />
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Smartphone className="h-12 w-12 text-[#CDB586]/40" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border ${getConditionBadge(product.condition)}`}>
                    {product.condition.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-[#0E161B] line-clamp-1">{product.name}</h3>
                  <p className="text-sm text-[#5F3C18]">{product.model}</p>
                  <p className="text-xs text-[#5F3C18]">{product.category?.name}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-[#5F3C18]">
                    {product.variants?.length || 0} variant{(product.variants?.length || 0) !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-[#5F3C18]">
                    {product.totalStock} in stock
                  </p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    {product.minPrice === product.maxPrice ? (
                      <p className="font-bold text-[#0E161B]">${product.minPrice.toLocaleString()}</p>
                    ) : (
                      <p className="font-bold text-[#0E161B]">
                        ${product.minPrice.toLocaleString()} - ${product.maxPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold border ${getStatusColor(product.status)}`}>
                    {product.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-[#CDB586] text-[#CDB586]">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                    <Button size="sm" className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}