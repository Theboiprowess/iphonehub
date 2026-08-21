"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Package,
  TrendingUp,
  Users,
  ShoppingCart
} from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminCard } from "@/components/admin/admin-card";
import { SearchToolbar } from "@/components/admin/search-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatCard } from "@/components/admin/stat-card";
import { formatPrice } from "@/lib/utils";

type WishlistItem = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  productCondition: string;
  categoryName: string;
  variantId: string;
  storage: string;
  colour: string;
  price: number;
  addedAt: string;
};

type PopularProduct = {
  productId: string;
  productName: string;
  count: number;
};

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/admin/api/wishlist?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data = await response.json();
      setWishlistItems(data.wishlistItems);
      setPopularProducts(data.popularProducts);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [page, searchQuery]);

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="space-y-8 admin-page-container text-center">
          <AdminPageHeader title="Wishlist" subtitle="Manage customer wishlists" />
          <div className="flex items-center justify-center h-64">
            <div className="text-[#5F3C18]">Loading wishlist data...</div>
          </div>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container">
        <AdminPageHeader title="Wishlist" subtitle="Manage customer wishlists" />

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Wishlist Items"
          value={wishlistItems.length}
          icon={Heart}
        />
        <StatCard
          title="Unique Customers"
          value={new Set(wishlistItems.map((item) => item.customerId)).size}
          icon={Users}
        />
        <StatCard
          title="Popular Products"
          value={popularProducts.length}
          icon={TrendingUp}
        />
      </div>

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <AdminCard title="Most Wishlisted Products">
          <div className="space-y-2">
            {popularProducts.map((product, index) => (
              <div key={product.productId} className="flex items-center justify-between bg-[#F7F5EF]/50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-[#CDB586] rounded-full text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-[#0E161B]">{product.productName}</div>
                    <div className="text-sm text-[#5F3C18]/60">{product.count} customers</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#CDB586]">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Search */}
      <SearchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search wishlist by product or customer..."
      />

      {/* Wishlist Items */}
      <AdminCard title={`Wishlist Items (${wishlistItems.length})`}>
        {wishlistItems.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="No wishlist items found"
            description="No wishlist items match your current search"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#CDB586]/20">
                  <th className="text-left p-4 font-semibold text-[#0E161B]">Customer</th>
                  <th className="text-left p-4 font-semibold text-[#0E161B]">Product</th>
                  <th className="text-left p-4 font-semibold text-[#0E161B]">Variant</th>
                  <th className="text-left p-4 font-semibold text-[#0E161B]">Price</th>
                  <th className="text-left p-4 font-semibold text-[#0E161B]">Added</th>
                </tr>
              </thead>
              <tbody>
                {wishlistItems.map((item) => (
                  <tr key={item.id} className="border-b border-[#CDB586]/10 hover:bg-[#CDB586]/5">
                    <td className="p-4">
                      <div className="font-medium text-[#0E161B]">{item.customerName}</div>
                      <div className="text-sm text-[#5F3C18]/60">{item.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-[#0E161B]">{item.productName}</div>
                      <div className="text-sm text-[#5F3C18]/60">{item.categoryName}</div>
                      <div className="text-sm text-[#5F3C18]/60">{item.productCondition}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[#0E161B]">{item.storage}</div>
                      <div className="text-sm text-[#5F3C18]/60">{item.colour}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-[#0E161B]">{formatPrice(item.price)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-[#5F3C18]">
                        {new Date(item.addedAt).toLocaleDateString()}
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
      </AdminCard>
    </div>
    </AdminPageContainer>
  );
}
