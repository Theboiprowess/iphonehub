"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Headphones } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function AccessoriesPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader title="Accessories" subtitle="Manage accessories inventory" />

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-12 text-center">
          <Headphones className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Accessories coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
