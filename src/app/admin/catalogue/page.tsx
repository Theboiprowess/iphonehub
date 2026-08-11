"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search, MoreVertical, Edit, Trash2, Package } from "lucide-react";
import { CatalogueProductCard } from "@/components/catalogue-product-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function CatalogueAdminPage() {
  const [loading, setLoading] = useState(true);
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const fetchCatalogue = async () => {
    try {
      const response = await fetch('/admin/api/catalogue');
      const data = await response.json();
      setCatalogue(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch catalogue:', error);
      setCatalogue([]);
    } finally {
      setLoading(false);
    }
  };

  // Group by series
  const groupedBySeries = catalogue.reduce((acc: Record<string, any[]>, item: any) => {
    if (!acc[item.series]) {
      acc[item.series] = [];
    }
    acc[item.series].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  // Filter catalogue
  const filteredCatalogue = catalogue.filter((item: any) => {
    const matchesSearch = searchQuery === "" || 
      item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeries = selectedSeries === "all" || item.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  // Get unique series
  const seriesList = Array.from(new Set(catalogue.map((item: any) => item.series)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#CAA45A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader 
        title="Price Catalogue"
        subtitle="Manage iPhone models, storage variants and pricing"
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-0 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]/40" />
          <Input
            placeholder="Search catalogue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
          <select
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
            className="px-4 py-2 border border-[#CDB586]/30 rounded-lg bg-white text-[#0E161B] focus:outline-none focus:ring-2 focus:ring-[#CDB586] flex-shrink-0"
          >
            <option value="all">All Series</option>
            {seriesList.map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </select>

          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 whitespace-nowrap flex-shrink-0"
          >
            Import
          </Button>

          <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] whitespace-nowrap flex-shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {catalogue.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-[#CDB586]/40" />
          <h3 className="text-xl font-semibold text-[#0E161B] mb-2">No catalogue items yet</h3>
          <p className="text-[#5F3C18] mb-6">Add your first iPhone to begin building your price catalogue</p>
          <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
            <Plus className="h-4 w-4 mr-2" />
            Add Catalogue Item
          </Button>
        </div>
      ) : (
        /* Catalogue Display */
        <div className="space-y-8">
          {Object.entries(groupedBySeries).map(([series, items]: [string, any[]]) => (
            <div key={series} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#0E161B] font-manrope">{series}</h2>
                <span className="text-sm text-[#5F3C18]">{items.length} items</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item: any) => (
                  <div key={item.id} className="relative group min-w-0">
                    <CatalogueProductCard
                      model={item.model}
                      storage={item.storage}
                      price={Number(item.price)}
                      imageKey={item.imageKey}
                      imageOverride={item.imageOverride}
                    />
                    {/* Actions overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur shadow-md hover:bg-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#CDB586]/20">
              <h2 className="text-xl font-bold text-[#0E161B]">Import Catalogue Items</h2>
            </div>
            <div className="p-6">
              <p className="text-[#5F3C18] text-sm mb-4">
                Paste your iPhone list below. Format:
              </p>
              <pre className="text-[#5F3C18]/60 text-sm bg-[#F7F5EF] p-4 rounded mb-4">
iPhone 17 Series
iPhone 17 Pro Max 256GB – $1650

iPhone 16 Series
iPhone 16 Pro Max 256GB – $900
iPhone 16 Plus 128GB – $780
              </pre>
              <textarea
                className="w-full h-48 p-4 border border-[#CDB586]/30 rounded-lg bg-[#F7F5EF] text-[#0E161B]"
                placeholder="Paste your catalogue data here..."
              />
            </div>
            <div className="p-6 border-t border-[#CDB586]/20 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
                className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
              >
                Cancel
              </Button>
              <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
                Import Items
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
