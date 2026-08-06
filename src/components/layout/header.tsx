"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, Menu, X, Phone, House, Smartphone, Package, Headphones, Info, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/cart-drawer";

const mainNavigation = [
  { name: "Home", href: "/", icon: House },
  { name: "iPhones", href: "/iphones", icon: Smartphone },
  { name: "Boxed iPhones", href: "/iphones?condition=boxed", icon: Package },
  { name: "Pre-Owned", href: "/iphones?condition=pre-owned", icon: Smartphone },
  { name: "Second-Hand", href: "/iphones?condition=second-hand", icon: Smartphone },
];

const secondaryNavigation = [
  { name: "Accessories", href: "/accessories", icon: Headphones },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CDB586] bg-[#0E161B]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0E161B]">
      <nav className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 w-[160px]">
            <Link href="/" className="block">
              <span className="text-lg font-bold tracking-tight text-[#EBE2C5] font-manrope whitespace-nowrap">
                iPhone Hub
                <br />
                <span className="text-[#CDB586]">Masvingo</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Main Navigation */}
            <div className="flex items-center gap-5">
              {mainNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[#CDB586] flex items-center gap-2 whitespace-nowrap",
                      pathname === item.href
                        ? "text-[#CDB586]"
                        : "text-[#EBE2C5]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Secondary Navigation */}
            <div className="flex items-center gap-5">
              {secondaryNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-[#CDB586] flex items-center gap-2 whitespace-nowrap",
                      pathname === item.href
                        ? "text-[#CDB586]"
                        : "text-[#EBE2C5]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop Icons */}
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] hover:bg-[#CDB586]/10 h-10 w-10">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] hover:bg-[#CDB586]/10 h-10 w-10">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <CartDrawer />
            
            <Link href="/iphones">
              <Button 
                variant="primary" 
                size="sm"
                className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] px-5 py-2.5 text-sm font-medium whitespace-nowrap hidden lg:block"
              >
                SHOP NOW
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#EBE2C5]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-[#0E161B]/95 backdrop-blur" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#0E161B] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-[#CDB586]/20">
            <div className="flex items-center justify-between mb-6">
              <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                <span className="text-lg font-bold tracking-tight text-[#EBE2C5] font-manrope">
                  iPhone Hub
                  <br />
                  <span className="text-[#CDB586]">Masvingo</span>
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-[#EBE2C5]"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="flow-root">
              <div className="-my-6 divide-y divide-[#CDB586]/20">
                <div className="space-y-2 py-6">
                  {[...mainNavigation, ...secondaryNavigation].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-[#EBE2C5] hover:bg-[#CDB586]/10 whitespace-nowrap"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 text-[#CDB586]" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
                <div className="py-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] h-10 w-10">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] h-10 w-10">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <Link href="/iphones" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="primary" 
                      className="w-full bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5]"
                    >
                      SHOP NOW
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10"
                    onClick={() => {
                      const whatsappNumber = "263773227172";
                      const message = "Hello iPhone Hub Masvingo, I would like to enquire about your iPhones.";
                      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
