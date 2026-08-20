import { getIPhoneImageUrl } from "@/lib/iphone-image-provider";

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
  // Determine image source - manual upload only
  let imageUrl: string | null = null;
  
  if (imageOverride) {
    imageUrl = imageOverride;
  } else {
    // Try to get manually uploaded image from provider
    imageUrl = getIPhoneImageUrl(model);
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#EBE2C5] to-[#F7F5EF] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={model}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📱
          </div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4 pl-8 pr-6 space-y-2 text-center">
        <h3 className="text-[#0E161B] font-semibold text-sm font-manrope line-clamp-2">
          {model}
        </h3>
        <p className="text-xs text-[#5F3C18]">{storage}</p>
        <p className="text-lg font-bold text-[#CAA45A]">${Number(price).toFixed(2)}</p>
      </div>
    </div>
  );
}
