"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function TradeInPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader title="Trade-In Requests" subtitle="Manage trade-in requests" />

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Trade-in requests coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
