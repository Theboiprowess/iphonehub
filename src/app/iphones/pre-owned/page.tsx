"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PreOwnediPhonesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve any existing search params and add condition=pre-owned
    const params = new URLSearchParams(searchParams.toString());
    params.set("condition", "pre-owned");
    router.replace(`/iphones?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Loading pre-owned iPhones...</p>
    </div>
  );
}
