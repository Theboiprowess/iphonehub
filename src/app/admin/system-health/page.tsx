"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function SystemHealthPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader 
        title="System Health"
        subtitle="Monitor system health"
      />

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-12 text-center">
          <Activity className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">System health coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
