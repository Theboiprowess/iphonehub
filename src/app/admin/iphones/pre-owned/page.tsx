"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminPageContainer } from "@/components/admin/admin-page-container";

export default function AdminPreOwnediPhonesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve any existing search params and add condition=pre-owned
    const params = new URLSearchParams(searchParams.toString());
    params.set("condition", "pre-owned");
    router.replace(`/admin/iphones?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <AdminPageContainer>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center admin-page-container text-center">
        <p className="text-gray-600">Loading pre-owned iPhones...</p>
      </div>
    </AdminPageContainer>
  );
}
