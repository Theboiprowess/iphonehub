"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5EF] p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-[#CDB586]/20 p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#0E161B] mb-2">
            Something went wrong
          </h2>
          
          <p className="text-[#5F3C18] mb-6">
            {error.message || "An unexpected error occurred while loading this page."}
          </p>

          {error.digest && (
            <p className="text-xs text-[#5F3C18]/60 mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Link href="/admin">
              <Button variant="outline" className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
