"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Search, MoreVertical, Edit, Trash2, Package } from "lucide-react";
import { CatalogueProductCard } from "@/components/catalogue-product-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

export default function CatalogueAdminPage() {
  const [loading, setLoading] = useState(true);
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("all");
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState("");
  const [importing, setImporting] = useState(false);
  const [migrating, setMigrating] = useState(false);

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const fetchCatalogue = async () => {
    try {
      console.log('ADMIN PAGE: Fetching catalogue...');
      const apiUrl = '/admin/api/catalogue';
      console.log('ADMIN PAGE: Fetching from URL:', apiUrl);
      console.log('ADMIN PAGE: Current page path:', window.location.pathname);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('ADMIN PAGE: Response status:', response.status);
      console.log('ADMIN PAGE: Response type:', response.type);
      console.log('ADMIN PAGE: Response URL:', response.url);
      
      if (!response.ok) {
        console.error('ADMIN PAGE: API returned error status:', response.status);
        try {
          const errorData = await response.json();
          console.error('ADMIN PAGE: Error data:', errorData);
          console.error('ADMIN PAGE: Error message:', errorData.error);
          console.error('ADMIN PAGE: Error details:', errorData.details);
          
          // If table doesn't exist, prompt to migrate
          if (errorData.error && errorData.error.includes('table')) {
            if (confirm("The PriceCatalogue table doesn't exist in the database. Would you like to create it now?")) {
              handleMigrate();
              return;
            }
          }
          
          // Always prompt for migration if we get a 500 error on catalogue
          if (response.status === 500) {
            if (confirm("The catalogue API returned an error because the database schema is outdated. Would you like to update the table schema now?")) {
              handleMigrate();
              return;
            }
          }
        } catch (e) {
          console.error('ADMIN PAGE: Could not parse error response');
          
          // Fallback prompt
          if (response.status === 500) {
            if (confirm("The catalogue API returned an error. Would you like to update the database schema?")) {
              handleMigrate();
              return;
            }
          }
        }
        setCatalogue([]);
        return;
      }
      
      const data = await response.json();
      console.log('ADMIN PAGE: Response data:', data);
      console.log('ADMIN PAGE: Is array?', Array.isArray(data));
      
      if (Array.isArray(data)) {
        setCatalogue(data);
      } else if (data.error) {
        console.error('ADMIN PAGE: API returned error:', data.error);
        setCatalogue([]);
      } else {
        console.error('ADMIN PAGE: Unexpected data format:', data);
        setCatalogue([]);
      }
    } catch (error) {
      console.error('ADMIN PAGE: Failed to fetch catalogue:', error);
      setCatalogue([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      alert("Please paste some data to import");
      return;
    }

    setImporting(true);
    try {
      const response = await fetch('/admin/api/catalogue/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: importData }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Successfully imported ${result.imported} of ${result.total} items`);
        setShowImportModal(false);
        setImportData("");
        fetchCatalogue();
      } else {
        if (result.needsMigration) {
          if (confirm("The PriceCatalogue table doesn't exist yet. Would you like to create it now?")) {
            handleMigrate();
          }
        } else {
          alert(`Import failed: ${result.error || result.details || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const handleMigrate = async () => {
    setMigrating(true);
    try {
      const response = await fetch('/admin/api/catalogue/migrate', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert('PriceCatalogue table created successfully! You can now import items.');
        fetchCatalogue();
      } else {
        alert(`Migration failed: ${result.error || result.details || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed. Please try again.');
    } finally {
      setMigrating(false);
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
    <AdminPageContainer>
      <div className="space-y-6">
        {/* Header */}
        <AdminPageHeader 
          title="Price Catalogue"
          subtitle="Manage iPhone models, storage variants and pricing"
        />

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-[#CDB586]/20 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-0 max-w-2xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]/40" />
            <Input
              placeholder="Search catalogue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="px-4 py-2.5 border border-[#CDB586]/30 rounded-lg bg-white text-[#0E161B] focus:outline-none focus:ring-2 focus:ring-[#CDB586] text-sm min-w-[140px] flex-shrink-0"
            >
              <option value="all">All Series</option>
              {seriesList.map(series => (
                <option key={series} value={series}>{series}</option>
              ))}
            </select>

            <Button
              onClick={() => setShowImportModal(true)}
              variant="outline"
              className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 h-10 px-4 flex-shrink-0"
            >
              Import
            </Button>

            <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] h-10 px-4 flex-shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {catalogue.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-[#F7F5EF] rounded-2xl shadow-lg border border-[#CDB586]/30 p-16 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#CDB586]/20 to-[#CDB586]/10 mb-8 shadow-lg">
            <Package className="h-12 w-12 text-[#CAA45A]" />
          </div>
          <h3 className="text-3xl font-bold text-[#0E161B] mb-4 font-manrope">No catalogue items yet</h3>
          <p className="text-[#5F3C18] mb-10 max-w-lg mx-auto text-lg leading-relaxed">
            Start building your iPhone price catalogue by adding your first item. This will help you manage pricing and inventory professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleMigrate}
              disabled={migrating}
              variant="outline"
              className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 h-12 px-8 text-base font-semibold"
            >
              {migrating ? 'Updating Schema...' : 'Update Database Schema'}
            </Button>
            <Button
              onClick={() => setShowImportModal(true)}
              variant="outline"
              className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 h-12 px-8 text-base font-semibold"
            >
              Import Items
            </Button>
            <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] h-12 px-8 text-base font-semibold shadow-md">
              <Plus className="h-5 w-5 mr-2" />
              Add Catalogue Item
            </Button>
          </div>
        </div>
      ) : (
        /* Catalogue Display */
        <div className="space-y-6">
          {Object.entries(groupedBySeries).map(([series, items]: [string, any[]]) => (
            <div key={series} className="bg-white rounded-2xl shadow-sm border border-[#CDB586]/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#CDB586]/20 bg-[#F7F5EF]/30">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#0E161B] font-manrope">{series}</h2>
                  <span className="text-sm text-[#5F3C18] font-medium px-3 py-1 bg-[#CDB586]/20 rounded-full">{items.length} items</span>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
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
                            <Button size="icon" variant="secondary" className="bg-white/90 backdrop-blur shadow-md hover:bg-white h-8 w-8">
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
            </div>
          ))}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#CDB586]/20">
              <h2 className="text-xl font-bold text-[#0E161B] font-manrope">Import Catalogue Items</h2>
            </div>
            <div className="p-6">
              <p className="text-[#5F3C18] text-sm mb-4 font-medium">
                Paste your iPhone list below. Format:
              </p>
              <pre className="text-[#5F3C18]/60 text-sm bg-[#F7F5EF] p-4 rounded-lg mb-4 font-mono">
iPhone 17 Series
iPhone 17 Pro Max 256GB – $1650

iPhone 16 Series
iPhone 16 Pro Max 256GB – $900
iPhone 16 Plus 128GB – $780
              </pre>
              <textarea
                className="w-full h-48 p-4 border border-[#CDB586]/30 rounded-lg bg-[#F7F5EF] text-[#0E161B] focus:outline-none focus:ring-2 focus:ring-[#CDB586] resize-none"
                placeholder="Paste your catalogue data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
            </div>
            <div className="p-6 border-t border-[#CDB586]/20 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportModal(false);
                  setImportData("");
                }}
                disabled={importing}
                className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 h-10 px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={importing}
                className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] h-10 px-6"
              >
                {importing ? 'Importing...' : 'Import Items'}
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminPageContainer>
  );
}
