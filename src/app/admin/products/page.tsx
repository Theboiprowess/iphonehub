"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Package, Plus, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/admin/api/products?limit=50");
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

  const statusCounts = {
    DRAFT: products.filter(p => p.status === "DRAFT").length,
    PUBLISHED: products.filter(p => p.status === "PUBLISHED").length,
    HIDDEN: products.filter(p => p.status === "HIDDEN").length,
    OUT_OF_STOCK: products.filter(p => p.status === "OUT_OF_STOCK").length,
    SOLD: products.filter(p => p.status === "SOLD").length,
    ARCHIVED: products.filter(p => p.status === "ARCHIVED").length,
  };

  return (
    <div className="w-full max-w-full p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0E161B]">Products</h1>
            <p className="text-[#5F3C18] mt-1">Manage your product catalogue</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#CDB586]/20 shadow-sm p-6">
            <p className="text-sm font-medium text-[#5F3C18]">Total Products</p>
            <p className="text-3xl font-bold text-[#0E161B] mt-2">{products.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#CDB586]/20 shadow-sm p-6">
            <p className="text-sm font-medium text-[#5F3C18]">Published</p>
            <p className="text-3xl font-bold text-[#0E161B] mt-2">{statusCounts.PUBLISHED}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#CDB586]/20 shadow-sm p-6">
            <p className="text-sm font-medium text-[#5F3C18]">Draft</p>
            <p className="text-3xl font-bold text-[#0E161B] mt-2">{statusCounts.DRAFT}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#CDB586]/20 shadow-sm p-6">
            <p className="text-sm font-medium text-[#5F3C18]">Out of Stock</p>
            <p className="text-3xl font-bold text-[#0E161B] mt-2">{statusCounts.OUT_OF_STOCK}</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-[#CDB586]/20">
            <Loader2 className="h-8 w-8 animate-spin text-[#CDB586]" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchProducts} variant="outline" className="border-[#CDB586] text-[#CDB586]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-[#CDB586]/10 flex items-center justify-center mx-auto mb-6">
              <Package className="h-8 w-8 text-[#CDB586]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0E161B] mb-2">No products yet</h3>
            <p className="text-[#5F3C18] mb-6">Get started by adding your first product</p>
            <Link href="/admin/products/new">
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-6">
            <h3 className="text-lg font-semibold text-[#0E161B] mb-4">Products ({products.length})</h3>
            <div className="space-y-2">
              {products.slice(0, 10).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-[#F7F5EF] rounded-lg">
                  <div>
                    <p className="font-medium text-[#0E161B]">{product.name}</p>
                    <p className="text-sm text-[#5F3C18]">{product.model}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      product.status === "PUBLISHED" ? "bg-green-100 text-green-800" :
                      product.status === "DRAFT" ? "bg-gray-100 text-gray-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              ))}
              {products.length > 10 && (
                <p className="text-center text-sm text-[#5F3C18] pt-2">
                  And {products.length - 10} more products...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}