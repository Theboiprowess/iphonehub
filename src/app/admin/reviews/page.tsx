"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export default function ReviewsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader title="Reviews" subtitle="Manage customer reviews" />

      <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
        <CardContent className="p-12 text-center">
          <Star className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
          <p className="font-medium text-[#5F3C18]">Reviews coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
