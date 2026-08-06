import { Smartphone } from "lucide-react";

interface ProductImageFallbackProps {
  message?: string;
  className?: string;
}

export function ProductImageFallback({ message = "Product image coming soon", className = "" }: ProductImageFallbackProps) {
  return (
    <div className={`relative flex items-center justify-center bg-gradient-to-br from-[#EBE2C5] to-[#F7F5EF] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#81592B]/5 to-[#5F3C18]/5"></div>
      <div className="relative z-10 text-center p-6">
        <Smartphone className="h-16 w-16 mx-auto mb-3 text-[#CDB586]/40" />
        <p className="text-sm text-[#5F3C18]/60">{message}</p>
      </div>
    </div>
  );
}
