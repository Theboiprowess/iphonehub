"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

export default function BusinessPage() {
  return (
    <AdminPageContainer>
      <div className="space-y-6 admin-page-container">
        <AdminPageHeader 
          title="Business Info"
          subtitle="Manage business information"
        />

        <Card className="bg-[#F7F5EF] border-[#CDB586]">
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium text-[#5F3C18]">Business info coming soon</p>
          </CardContent>
        </Card>
      </div>
    </AdminPageContainer>
  );
}
