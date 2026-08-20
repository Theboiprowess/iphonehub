"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, Menu, X, Phone, House, Smartphone, Package, Headphones, Info, ChevronDown, Image as ImageIcon, DollarSign, RefreshCw } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/cart-drawer";

const mainNavigation = [
  { name: "Home", href: "/", icon: House },
  { name: "iPhones", href: "/iphones", icon: Smartphone },
  { name: "Boxed", href: "/iphones?condition=boxed", icon: Package },
  { name: "Pre-Owned", href: "/iphones?condition=pre-owned", icon: Smartphone },
  { name: "Second-Hand", href: "/iphones?condition=second-hand", icon: Smartphone },
];

const secondaryNavigation = [
  { name: "Price Catalogue", href: "/catalogue", icon: DollarSign },
  { name: "Accessories", href: "/accessories", icon: Headphones },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Trade-In", href: "/trade-in", icon: RefreshCw },
  { name: "About Us", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
        if (searchOpen) {
          setSearchOpen(false);
        }
      }
    };

    if (mobileMenuOpen || searchOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen, searchOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/iphones?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#CDB586] bg-[#0E161B]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0E161B]">
      <nav className="site-container" aria-label="Global">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo icon.jpeg"
                alt="iPhone Hub Zimbabwe"
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-lg object-contain"
              />
              <span className="text-sm sm:text-lg font-bold tracking-tight text-[#EBE2C5] font-manrope whitespace-nowrap">
                iPhone Hub
                <br />
                <span className="text-[#CDB586] text-xs sm:text-base">Zimbabwe</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 min-w-0">
            {/* Main Navigation */}
            <div className="flex items-center gap-3 min-w-0">
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
            <div className="flex items-center gap-3 min-w-0">
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
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#EBE2C5] hover:text-[#CDB586] hover:bg-[#CDB586]/10 h-10 w-10"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="h-5 w-5" />
                </Button>
                {searchOpen && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-[#0E161B] border border-[#CDB586]/20 rounded-lg shadow-xl p-3 z-50">
                    <form onSubmit={handleSearch} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Search iPhones..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-[#F7F5EF] text-[#0E161B] px-4 py-2.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB586]"
                        autoFocus
                      />
                      <Button type="submit" size="sm" variant="primary">
                        Search
                      </Button>
                    </form>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] hover:bg-[#CDB586]/10 h-10 w-10">
                <Heart className="h-5 w-5" />
              </Button>
              <CartDrawer />
            </div>

            {/* Mobile Icons */}
            <div className="flex lg:hidden items-center gap-2">
              <CartDrawer />
            </div>

            <LinkButton
              href="/iphones"
              variant="primary"
              size="default"
            >
              SHOP NOW
            </LinkButton>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                className="text-[#EBE2C5] hover:text-[#CDB586] p-2"
                onClick={toggleMobileMenu}
                aria-label="Open menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeMobileMenu}
          />
          
          {/* Menu Panel */}
          <div className="lg:hidden fixed top-20 left-0 right-0 z-50 bg-[#0E161B] border-t border-[#CDB586]/30 animate-slide-down max-h-[calc(100dvh-5rem)] overflow-y-auto">
            <div className="px-6 py-10 sm:px-8">
              <div className="space-y-10">
                {/* Main Navigation */}
                <div>
                  <p className="text-sm font-bold text-[#CDB586] uppercase tracking-wider mb-6">Main Menu</p>
                  <div className="space-y-3">
                    {mainNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-4 px-6 py-4 text-lg font-medium text-[#EBE2C5] hover:bg-[#CDB586]/15 rounded-2xl transition-all border border-transparent hover:border-[#CDB586]/30 min-h-[64px] min-w-0"
                        >
                          <div className="h-12 w-12 rounded-xl bg-[#CDB586]/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-[#CDB586]" />
                          </div>
                          <span className="whitespace-normal">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Secondary Navigation */}
                <div>
                  <p className="text-sm font-bold text-[#CDB586] uppercase tracking-wider mb-6">More</p>
                  <div className="space-y-3">
                    {secondaryNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-4 px-6 py-4 text-lg font-medium text-[#EBE2C5] hover:bg-[#CDB586]/15 rounded-2xl transition-all border border-transparent hover:border-[#CDB586]/30 min-h-[64px] min-w-0"
                        >
                          <div className="h-12 w-12 rounded-xl bg-[#CDB586]/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="h-6 w-6 text-[#CDB586]" />
                          </div>
                          <span className="whitespace-normal">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8 border-t border-[#CDB586]/20">
                  <LinkButton href="/iphones" onClick={closeMobileMenu} variant="primary" className="w-full">
                    SHOP NOW
                  </LinkButton>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}