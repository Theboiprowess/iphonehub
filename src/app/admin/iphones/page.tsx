"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageContainer } from "@/components/admin/admin-page-container";
import { AdminCard } from "@/components/admin/admin-card";
import { EmptyState } from "@/components/admin/empty-state";

export default function iPhonesPage() {
  return (
    <AdminPageContainer>
      <div className="space-y-8 admin-page-container text-center">
        <AdminPageHeader 
          title="iPhones"
          subtitle="Manage iPhone inventory"
        />

        <AdminCard>
          <EmptyState
            icon={Smartphone}
            title="iPhone management coming soon"
            description="This feature is under development and will be available soon"
          />
        </AdminCard>
      </div>
    </AdminPageContainer>
  );
}
