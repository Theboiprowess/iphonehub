"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tag, Plus, RefreshCw } from "lucide-react";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/admin/api/promotions");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to load promotions");
      }
      
      setPromotions(data.promotions || []);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setError(error instanceof Error ? error.message : "Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0E161B]">Promotions</h1>
            <p className="text-[#5F3C18] mt-1">Manage promotions and discounts</p>
          </div>
          <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
            <Plus className="h-4 w-4 mr-2" />
            Add Promotion
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-[#CDB586]/20">
            <Tag className="h-8 w-8 animate-spin text-[#CDB586]" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPromotions} variant="outline" className="border-[#CDB586] text-[#CDB586]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : promotions.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-[#CDB586]/10 flex items-center justify-center mx-auto mb-6">
              <Tag className="h-8 w-8 text-[#CDB586]" />
            </div>
            <h3 className="text-xl font-semibold text-[#0E161B] mb-2">No promotions yet</h3>
            <p className="text-[#5F3C18] mb-6">Get started by adding your first promotion</p>
            <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
              <Plus className="h-4 w-4 mr-2" />
              Add Promotion
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#CDB586]/20 p-6">
            <h3 className="text-lg font-semibold text-[#0E161B] mb-4">Promotions ({promotions.length})</h3>
            <div className="space-y-2">
              {promotions.slice(0, 10).map((promotion) => (
                <div key={promotion.id} className="flex items-center justify-between p-4 bg-[#F7F5EF] rounded-lg">
                  <div>
                    <p className="font-medium text-[#0E161B]">{promotion.name}</p>
                    <p className="text-sm text-[#5F3C18]">{promotion.type}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      promotion.status === "ACTIVE" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {promotion.status}
                    </span>
                  </div>
                </div>
              ))}
              {promotions.length > 10 && (
                <p className="text-center text-sm text-[#5F3C18] pt-2">
                  And {promotions.length - 10} more promotions...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
