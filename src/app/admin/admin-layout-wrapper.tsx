"use client";

import { useState, useEffect } from "react";
import { AdminSidebar, AdminTopbar } from "@/components/admin/admin-sidebar";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render sidebar controlled state until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F7F5EF] to-[#EBE2C5] flex">
        <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <AdminTopbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 sm:p-8 lg:p-10 max-w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F7F5EF] to-[#EBE2C5] flex">
      <AdminSidebar 
        mobileOpen={mobileMenuOpen} 
        setMobileOpen={setMobileMenuOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <AdminTopbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="flex-1 overflow-y-auto w-full">
          <div className="p-6 sm:p-8 lg:p-10 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}