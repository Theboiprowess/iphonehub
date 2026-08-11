"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Box } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Inventory"
        subtitle="Manage inventory and stock"
      />

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-12 text-center">
          <Box className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Inventory coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
