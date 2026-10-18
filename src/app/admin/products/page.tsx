"use client";

import { Loader2, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminCard } from "@/components/admin/admin-card";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/admin/empty-state";
import { ResponsiveGrid } from "@/components/admin/responsive-grid";
import { Button } from "@/components/ui/button";

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
            icon={Package}
            color="#CDB586"
          />
          <StatCard
            title="Draft"
            value={statusCounts.DRAFT}
            icon={Package}
            color="#CDB586"
          />
          <StatCard
            title="Out of Stock"
            value={statusCounts.OUT_OF_STOCK}
            icon={Package}
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
              description={`Found ${products.length} products`}
            />
          </AdminCard>
        )}
      </div>
    </AdminPageContainer>
  );
}