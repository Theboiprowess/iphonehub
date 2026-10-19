import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F5EF]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#CDB586] mx-auto mb-4" />
        <p className="text-[#5F3C18]">Loading...</p>
      </div>
    </div>
  );
}
