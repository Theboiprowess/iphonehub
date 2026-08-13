"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BoxediPhonesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve any existing search params and add condition=boxed
    const params = new URLSearchParams(searchParams.toString());
    params.set("condition", "boxed");
    router.replace(`/iphones?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-600">Loading boxed iPhones...</p>
    </div>
  );
}
