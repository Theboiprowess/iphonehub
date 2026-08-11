import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import { ArrowRight, Package, BadgeCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    image: "/boxed-iphone.jpg.jpg",
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
    image: "/pre-owned-iphone.jpg.jpg",
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
    image: "/second-hand-iphone.jpg.jpg",
  },
];

export function CategoryCards() {
  return (
    <section className="section-spacing bg-[#F7F5EF]">
      <div className="site-container">
        <SectionHeader 
          title="Shop by Category"
          subtitle="Find the perfect iPhone that fits your budget and needs"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.title} href={category.href}>
                <Card className={`${category.bgClass} border ${category.accentClass} hover:shadow-xl transition-all group cursor-pointer h-full flex flex-col`}>
                  <CardHeader className="p-6 pb-5 flex-1">
                    {/* Icon */}
                    <div className={`h-14 w-14 rounded-xl ${category.iconBg} ${category.iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-xl text-[#EBE2C5]">{category.title}</CardTitle>
                      <div className="h-px w-12 bg-[#CDB586]/30"></div>
                    </div>
                    <CardDescription className="text-[#EBE2C5]/90 text-base pt-3">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6 pt-0 flex-1">
                    {/* Image */}
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#CDB586]/20 relative w-full">
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover"
                        quality={100}
                        priority={false}
                      />
                    </div>
                    <p className="text-sm text-[#EBE2C5]/70 leading-relaxed">{category.supportingText}</p>
                    <Button variant="outline" className="w-full border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B] group-hover:scale-105 transition-transform h-10">
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
