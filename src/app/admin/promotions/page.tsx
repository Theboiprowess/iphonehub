"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Promotions</h1>
        <p className="text-[#EBE2C5]/60">Manage promotions and discounts</p>
      </div>

      <Card className="bg-[#F7F5EF] border-[#CDB586]">
        <CardContent className="p-12 text-center">
          <Star className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Promotions coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}