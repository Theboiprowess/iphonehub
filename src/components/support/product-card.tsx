import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Package, ShoppingCart } from "lucide-react";
import type { ProductContext } from "@/lib/support-context";

interface ProductCardProps {
  product: ProductContext;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="bg-gradient-to-br from-[#0E161B]/80 to-[#0F1A20]/60 border-[#CDB586]/30 overflow-hidden shadow-lg ring-1 ring-[#CDB586]/20 hover:ring-[#CDB586]/40 transition-all duration-200">
      <CardContent className="p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          {product.image ? (
            <div className="relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md ring-2 ring-[#CDB586]/20"
              />
              <div className="absolute -top-2 -right-2 h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-br from-[#CDB586] to-[#B8A06E] rounded-full flex items-center justify-center shadow-md">
                <Package className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#0E161B]" />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#CDB586]/10 to-[#CDB586]/5 rounded-xl flex items-center justify-center shadow-md ring-2 ring-[#CDB586]/20">
              <span className="text-3xl sm:text-4xl">📱</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-[#EBE2C5] text-sm sm:text-base truncate leading-tight">
              {product.name}
            </h4>
            <p className="text-xs text-[#EBE2C5]/60 mt-1 font-medium">{product.model}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs font-semibold text-[#CDB586] bg-[#CDB586]/10 px-2 py-1 rounded-md">
                {product.storage}
              </span>
              <span className="text-xs text-[#EBE2C5]/30">•</span>
              <span className="text-xs font-semibold text-[#CDB586] bg-[#CDB586]/10 px-2 py-1 rounded-md">
                {product.colour}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 sm:mt-3">
              <p className="text-base sm:text-lg font-bold text-[#CDB586]">
                ${product.price}
              </p>
              <p
                className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  product.stock > 0 
                    ? "bg-green-500/20 text-green-400" 
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 pt-0">
        <Link href={product.url} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#CDB586]/50 text-[#CDB586] hover:bg-[#CDB586]/15 hover:border-[#CDB586] transition-all duration-200 rounded-xl font-medium text-xs sm:text-sm"
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
            View Product
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
