"use client";

import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

export default function ReturnsPage() {
  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container">
        <AdminPageHeader title="Returns" subtitle="Manage return policies" />

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-12 text-center">
            <RotateCcw className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium text-[#5F3C18]">Returns coming soon</p>
          </CardContent>
        </Card>
      </div>
    </AdminPageContainer>
  );
}
