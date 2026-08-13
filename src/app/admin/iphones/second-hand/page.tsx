"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminSecondHandiPhonesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve any existing search params and add condition=second-hand
    const params = new URLSearchParams(searchParams.toString());
    params.set("condition", "second-hand");
    router.replace(`/admin/iphones?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Loading second-hand iPhones...</p>
    </div>
  );
}
