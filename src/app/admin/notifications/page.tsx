"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

export default function NotificationsPage() {
  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container">
        <AdminPageHeader 
          title="Notifications"
          subtitle="Manage notifications"
        />

        <Card className="bg-[#F7F5EF] border-[#CDB586]/30">
          <CardContent className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-[#CDB586]/40" />
            <p className="font-medium text-[#5F3C18]">Notifications coming soon</p>
          </CardContent>
        </Card>
      </div>
    </AdminPageContainer>
  );
}
