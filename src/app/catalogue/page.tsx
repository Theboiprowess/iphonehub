"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { CatalogueProductCard } from "@/components/catalogue-product-card";

export default function CataloguePage() {
  const [catalogue, setCatalogue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from public API first, fall back to localStorage
    async function fetchCatalogue() {
      try {
        console.log('Fetching catalogue from API...');
        const response = await fetch('/api/catalogue');
        console.log('API response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Catalogue data fetched:', data);
        setCatalogue(data);
      } catch (error) {
        console.error('Failed to fetch catalogue from API:', error);
        
        // Fall back to localStorage
        const localData = localStorage.getItem('catalogueData');
        if (localData) {
          console.log('Using localStorage fallback');
          setCatalogue(JSON.parse(localData));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCatalogue();
  }, []);

  // Group by series
  const groupedBySeries = catalogue.reduce((acc, item) => {
    const series = item.series || 'Other';
    if (!acc[series]) {
      acc[series] = [];
    }
    acc[series].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F5EF] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#CAA45A] mx-auto mb-4" />
          <p className="text-[#5F3C18]">Loading catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EF]">
      <main className="section-spacing">
        <div className="site-container">
          <SectionHeader 
            title="ORIGINAL ICASSA SECOND HAND"
            subtitle="Looking for a genuine iPhone at the best price? We've got you covered! Original • SECOND HAND • Quality Guaranteed"
          />
        </div>

          {/* Catalogue */}
          <div className="space-y-12">
            {Object.keys(groupedBySeries).length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-[#5F3C18]">Price catalogue coming soon. Please check back later!</p>
              </div>
            ) : (
              Object.entries(groupedBySeries).map(([series, items]) => {
                if (!items || (items as any[]).length === 0) return null;
                return (
                <div key={series} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-[#0E161B] mb-6 font-manrope flex items-center gap-2">
                    <img 
                      src="/og.jfif" 
                      alt="iPhone" 
                      width={32}
                      height={32}
                      className="inline-block"
                    />
                    {series}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {(items as any[]).map((item: any) => {
                      try {
                        return (
                          <CatalogueProductCard
                            key={item.id || Math.random()}
                            model={item.model || 'iPhone'}
                            storage={item.storage || 'N/A'}
                            price={Number(item.price) || 0}
                            imageKey={item.imageKey}
                            imageOverride={item.imageOverride}
                          />
                        );
                      } catch (error) {
                        console.error('Error rendering catalogue item:', item, error);
                        return null;
                      }
                    })}
                  </div>
                </div>
                );
              })
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-16 bg-[#0E161B] rounded-2xl p-8 text-center">
            <div className="text-[#EBE2C5] space-y-4">
              <p className="text-lg font-medium">✅ Competitive Prices</p>
              <p className="text-lg font-medium">✅ Limited Stock – First Come, First Served!</p>
              <div className="mt-6 space-y-2">
                <p className="text-[#CDB586]">📍 Visit us at MEIKLES MARKET TABLE 56</p>
                <p className="text-[#CDB586]">📞 SABEKAH (CEO): +263784502347</p>
                <p className="text-[#CDB586]">📞 ARTWELL (CEO): +263773227172</p>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
}
