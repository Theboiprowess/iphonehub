"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Orders</h1>
          <p className="text-[#EBE2C5]/60">Manage customer orders</p>
        </div>
        <Link href="/admin/orders/new">
          <Button className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </Link>
      </div>

      <Card className="bg-[#F7F5EF] border-[#CDB586]">
        <CardContent className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Orders coming soon</p>
          <p className="text-sm text-[#5F3C18]/60">Order management module will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}