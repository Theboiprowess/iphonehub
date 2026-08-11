"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function SalesAnalyticsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Sales Analytics"
        subtitle="View sales data and trends"
      />

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-12 text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Sales analytics coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
