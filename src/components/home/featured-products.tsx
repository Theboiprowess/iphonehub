import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Heart, Smartphone, CircleCheck, AlertTriangle, CircleX } from "lucide-react";
import Link from "next/link";

// This will be replaced with actual data from the database
const featuredProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    model: "iPhone 15 Pro Max",
    storage: "256GB",
    colour: "Natural Titanium",
    condition: "PRE_OWNED",
    batteryHealth: 94,
    price: 1299,
    comparePrice: 1499,
    stock: 3,
  },
  {
    id: "2",
    name: "iPhone 14 Pro",
    model: "iPhone 14 Pro",
    storage: "128GB",
    colour: "Deep Purple",
    condition: "SECOND_HAND",
    batteryHealth: 87,
    price: 899,
    comparePrice: 999,
    stock: 2,
  },
  {
    id: "3",
    name: "iPhone 13",
    model: "iPhone 13",
    storage: "256GB",
    colour: "Midnight",
    condition: "BOXED",
    batteryHealth: 100,
    price: 1099,
    comparePrice: null,
    stock: 5,
  },
];

const conditionLabels: Record<string, { label: string; variant: "boxed" | "preOwned" | "secondHand" }> = {
  BOXED: { label: "Boxed / Brand New", variant: "boxed" },
  PRE_OWNED: { label: "Premium Pre-Owned", variant: "preOwned" },
  SECOND_HAND: { label: "Second-Hand", variant: "secondHand" },
};

const getStockIcon = (stock: number) => {
  if (stock > 0) return <CircleCheck className="h-4 w-4 text-[#CDB586]" />;
  if (stock === 0) return <CircleX className="h-4 w-4 text-[#5F3C18]" />;
  return <AlertTriangle className="h-4 w-4 text-[#9C7746]" />;
};

const getStockText = (stock: number) => {
  if (stock > 0) return `${stock} in stock`;
  if (stock === 0) return "Sold out";
  return "Low stock";
};

export function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-24 bg-[#F7F5EF]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0E161B] mb-4 font-manrope">
              Featured iPhones
            </h2>
            <p className="text-lg text-[#5F3C18]">
              Our most popular devices right now
            </p>
          </div>
          <Link href="/iphones">
            <Button variant="outline" className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]">
              View All iPhones
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all bg-[#F7F5EF] border-[#CDB586] overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#EBE2C5] to-[#F7F5EF] flex items-center justify-center relative border-b border-[#CDB586]/30">
                  {/* Product Image Placeholder */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#81592B]/5 to-[#5F3C18]/5"></div>
                    <div className="relative z-10 text-center p-6">
                      <Smartphone className="h-20 w-20 mx-auto mb-3 text-[#CDB586]/40" />
                      <p className="text-xs text-[#5F3C18]/60">Product image</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant={conditionLabels[product.condition].variant}>
                      {conditionLabels[product.condition].label}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-[#F7F5EF]/90 hover:bg-[#F7F5EF] text-[#5F3C18] backdrop-blur-sm"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2 text-[#0E161B]">{product.name}</h3>
                <div className="space-y-1 text-sm text-[#5F3C18] mb-4">
                  <p className="font-medium">{product.model}</p>
                  <p>{product.storage} • {product.colour}</p>
                  {product.condition !== "BOXED" && (
                    <p>Battery Health: {product.batteryHealth}%</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-[#0E161B]">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-[#81592B] line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {getStockIcon(product.stock)}
                  <span className="text-[#5F3C18]">{getStockText(product.stock)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-3">
                <Link href={`/iphones/${product.id}`} className="flex-1">
                  <Button className="w-full bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814]">
                    View Details
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]"
                  onClick={() => {
                    const whatsappNumber = "263773227172";
                    const message = `Hello iPhone Hub Masvingo, I am interested in the ${product.name} (${product.storage}, ${product.colour}). Is it still available?`;
                    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
