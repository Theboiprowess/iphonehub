"use client";

import { Hero } from "@/components/home/hero";
import { CategoryCards } from "@/components/home/category-cards";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrustCards } from "@/components/home/trust-cards";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <div className="w-full">
        <CategoryCards />
        <FeaturedProducts />
        <TrustCards />
      </div>
    </div>
  );
}
