import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, BadgeCheck, Smartphone } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    title: "BOXED iPHONES",
    description: "Premium boxed devices",
    supportingText: "Factory-sealed or boxed iPhones for customers who want a fresh premium experience.",
    href: "/iphones?condition=boxed",
    icon: Package,
    bgClass: "bg-[#0E161B]",
    accentClass: "border-[#CDB586]",
    iconBg: "bg-[#CDB586]",
    iconColor: "text-[#0E161B]",
  },
  {
    title: "PRE-OWNED iPHONES",
    description: "Quality devices. Exceptional value.",
    supportingText: "Carefully selected pre-owned iPhones inspected for quality and reliability.",
    href: "/iphones?condition=pre-owned",
    icon: BadgeCheck,
    bgClass: "bg-gradient-to-br from-[#81592B] to-[#5F3C18]",
    accentClass: "border-[#EBE2C5]",
    iconBg: "bg-[#CDB586]",
    iconColor: "text-[#0E161B]",
  },
  {
    title: "SECOND-HAND iPHONES",
    description: "Affordable iPhones for different budgets.",
    supportingText: "Quality second-hand iPhones at accessible prices.",
    href: "/iphones?condition=second-hand",
    icon: Smartphone,
    bgClass: "bg-[#5F3C18]",
    accentClass: "border-[#CDB586]",
    iconBg: "bg-[#CDB586]",
    iconColor: "text-[#0E161B]",
  },
];

export function CategoryCards() {
  return (
    <section className="py-16 sm:py-24 bg-[#F7F5EF]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0E161B] mb-4 font-manrope">
            Shop by Category
          </h2>
          <p className="text-lg text-[#5F3C18] max-w-2xl mx-auto">
            Find the perfect iPhone that fits your budget and needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.title} href={category.href}>
                <Card className={`${category.bgClass} border ${category.accentClass} hover:shadow-xl transition-all group cursor-pointer h-full`}>
                  <CardHeader className="pb-4">
                    {/* Icon */}
                    <div className={`h-16 w-16 rounded-xl ${category.iconBg} ${category.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl text-[#EBE2C5] mb-2">{category.title}</CardTitle>
                    <CardDescription className="text-[#EBE2C5]/90 text-base">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Image Placeholder */}
                    <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-[#0E161B]/30 to-[#5F3C18]/30 flex items-center justify-center border border-[#CDB586]/20">
                      <div className="text-center p-4">
                        <Smartphone className="h-12 w-12 mx-auto mb-2 text-[#CDB586]/60" />
                        <p className="text-xs text-[#EBE2C5]/60">iPhone image</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#EBE2C5]/70">{category.supportingText}</p>
                    <Button variant="outline" className="w-full border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B] group-hover:scale-105 transition-transform">
                      SHOP {category.title.split(" ")[0]}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
