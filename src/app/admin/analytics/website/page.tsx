"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";

export default function WebsiteAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Website Analytics</h1>
        <p className="text-[#EBE2C5]/60">View website traffic and performance</p>
      </div>

      <Card className="bg-[#F7F5EF] border-[#CDB586]">
        <CardContent className="p-12 text-center">
          <Globe className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Website analytics coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}