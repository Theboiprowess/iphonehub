"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="Orders"
        subtitle="Manage customer orders"
        actionHref="/admin/orders/new"
        actionText="New Order"
      />

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Orders coming soon</p>
          <p className="text-sm text-[#5F3C18]/60">Order management module will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
