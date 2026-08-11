"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Box, 
  Users, 
  Smartphone, 
  Headphones, 
  Tag, 
  MessageSquare, 
  Star, 
  Heart, 
  Home, 
  Info, 
  FileText, 
  Menu, 
  Image as ImageIcon, 
  CreditCard, 
  Truck, 
  Shield, 
  RotateCcw, 
  FileCheck, 
  Building2, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Bell, 
  UserCog, 
  FileSearch, 
  Activity, 
  Settings, 
  LogOut, 
  Search,
  Plus,
  ExternalLink,
  DollarSign,
  Bot,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigation = {
  MAIN: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Price Catalogue", href: "/admin/catalogue", icon: DollarSign },
    { name: "Inventory", href: "/admin/inventory", icon: Box },
    { name: "Customers", href: "/admin/customers", icon: Users },
  ],
  SHOP: [
    { name: "iPhones", href: "/admin/iphones", icon: Smartphone },
    { name: "Boxed iPhones", href: "/admin/iphones?condition=boxed", icon: Smartphone },
    { name: "Pre-Owned", href: "/admin/iphones?condition=pre-owned", icon: Smartphone },
    { name: "Second-Hand", href: "/admin/iphones?condition=second-hand", icon: Smartphone },
    { name: "Accessories", href: "/admin/accessories", icon: Headphones },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Promotions", href: "/admin/promotions", icon: Star },
  ],
  CUSTOMER: [
    { name: "Trade-In Requests", href: "/admin/trade-ins", icon: MessageSquare },
    { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Wishlist", href: "/admin/wishlist", icon: Heart },
  ],
  WEBSITE: [
    { name: "Homepage", href: "/admin/homepage", icon: Home },
    { name: "About Us", href: "/admin/about", icon: Info },
    { name: "Contact", href: "/admin/contact", icon: FileText },
    { name: "FAQ", href: "/admin/faq", icon: FileText },
    { name: "Blog", href: "/admin/blog", icon: FileText },
    { name: "Navigation", href: "/admin/navigation", icon: Menu },
    { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  ],
  BUSINESS: [
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Delivery", href: "/admin/delivery", icon: Truck },
    { name: "Warranty", href: "/admin/warranty", icon: Shield },
    { name: "Returns", href: "/admin/returns", icon: RotateCcw },
    { name: "Policies", href: "/admin/policies", icon: FileCheck },
    { name: "Business Info", href: "/admin/business", icon: Building2 },
  ],
  ANALYTICS: [
    { name: "Sales", href: "/admin/analytics/sales", icon: TrendingUp },
    { name: "Products", href: "/admin/analytics/products", icon: BarChart3 },
    { name: "Customers", href: "/admin/analytics/customers", icon: Users },
    { name: "Website", href: "/admin/analytics/website", icon: Globe },
  ],
  AI_SUPPORT: [
    { name: "Prowess Dashboard", href: "/admin/support", icon: Bot },
    { name: "Conversations", href: "/admin/support/conversations", icon: MessageSquare },
    { name: "Knowledge Base", href: "/admin/support/knowledge", icon: FileText },
    { name: "Unanswered Questions", href: "/admin/support/unanswered", icon: FileSearch },
    { name: "Analytics", href: "/admin/support/analytics", icon: Activity },
  ],
  SYSTEM: [
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Admin Users", href: "/admin/admin-users", icon: UserCog },
    { name: "Audit Logs", href: "/admin/audit-logs", icon: FileSearch },
    { name: "System Health", href: "/admin/system-health", icon: Activity },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "lg:relative fixed left-0 top-0 z-50 h-screen bg-[#0E161B] border-r border-[#CDB586]/20 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-[#CDB586]/20 flex-shrink-0">
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-[#CDB586]">iPhone Hub</p>
              <p className="text-xs text-[#EBE2C5]/60">Zimbabwe Admin</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-[#EBE2C5] hover:text-[#CDB586] flex-shrink-0 hidden lg:flex"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="text-[#EBE2C5] hover:text-[#CDB586] flex-shrink-0 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {Object.entries(navigation).map(([section, items]) => (
            <div key={section} className="mb-6">
              {!collapsed && (
                <p className="px-4 mb-2 text-xs font-semibold text-[#CDB586]/60 uppercase tracking-wider">
                  {section}
                </p>
              )}
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "?");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-[#CDB586] text-[#0E161B]"
                        : "text-[#EBE2C5]/80 hover:bg-[#CDB586]/10 hover:text-[#CDB586]"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

export function AdminTopbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#CDB586]/20 bg-[#0E161B]/95 backdrop-blur flex-shrink-0">
      <div className="flex items-center justify-between h-16 px-6 lg:px-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden mr-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#EBE2C5] hover:text-[#CDB586]"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-0 mr-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#EBE2C5]/40" />
            <Input
              placeholder="Search products, orders, customers..."
              className="bg-[#F7F5EF]/5 border-[#CDB586]/20 text-[#EBE2C5] placeholder:text-[#EBE2C5]/40 pl-10"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
          {/* Quick Add */}
          <Link href="/admin/products/new">
            <Button size="sm" className="bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] hidden sm:flex whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>

          {/* Website Preview */}
          <Button variant="outline" size="sm" asChild className="border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586]/10 hidden sm:flex whitespace-nowrap">
            <Link href="/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Website
            </Link>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] flex-shrink-0">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-[#CDB586] rounded-full"></span>
          </Button>

          {/* Profile */}
          <Link href="/admin/(protected)/settings">
            <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] flex-shrink-0">
              <UserCog className="h-5 w-5" />
            </Button>
          </Link>

          {/* Logout */}
          <Link href="/api/auth/signout">
            <Button variant="ghost" size="icon" className="text-[#EBE2C5] hover:text-[#CDB586] flex-shrink-0">
              <LogOut className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}