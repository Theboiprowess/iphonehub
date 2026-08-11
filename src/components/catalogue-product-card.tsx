import Image from "next/image";
import { getIPhoneImageUrl } from "@/lib/iphone-image-provider";
import { ProductImageFallback } from "@/components/product-image-fallback";
import { useState } from "react";

interface CatalogueProductCardProps {
  model: string;
  storage: string;
  price: number;
  imageKey?: string;
  imageOverride?: string;
}

export function CatalogueProductCard({
  model,
  storage,
  price,
  imageKey,
  imageOverride,
}: CatalogueProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Determine image source
  let imageUrl: string | null = null;
  
  if (imageOverride) {
    imageUrl = imageOverride;
  } else if (imageKey) {
    imageUrl = getIPhoneImageUrl(model);
  }
  
  // Don't render image if URL is empty or null
  const shouldRenderImage = imageUrl && imageUrl.trim() !== '' && !imageError;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[#EBE2C5] to-[#F7F5EF] overflow-hidden">
        {shouldRenderImage ? (
          <Image
            src={imageUrl}
            alt={model}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        ) : (
          <ProductImageFallback 
            message={model} 
            className="w-full h-full"
          />
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-[#0E161B] font-semibold text-base font-manrope line-clamp-2">
          {model}
        </h3>
        <p className="text-sm text-[#5F3C18]">{storage}</p>
        <p className="text-xl font-bold text-[#CAA45A]">${Number(price).toFixed(2)}</p>
      </div>
    </div>
  );
}
