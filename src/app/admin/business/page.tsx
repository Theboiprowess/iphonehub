"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export default function BusinessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#EBE2C5] font-manrope">Business Info</h1>
        <p className="text-[#EBE2C5]/60">Manage business information</p>
      </div>

      <Card className="bg-[#F7F5EF] border-[#CDB586]">
        <CardContent className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Business info coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
