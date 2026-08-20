"use client";

import { useState, useEffect } from "react";
import { AdminSidebar, AdminTopbar } from "@/components/admin/admin-sidebar";
import { AdminShell, AdminShellSidebar, AdminShellHeader, AdminShellMain } from "@/components/admin/admin-shell";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render sidebar controlled state until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F7F5EF] to-[#EBE2C5]">
        <AdminShell sidebarWidth="260px">
          <AdminShellSidebar>
            <AdminSidebar mobileOpen={false} setMobileOpen={() => {}} />
          </AdminShellSidebar>
          <AdminShellHeader>
            <AdminTopbar onMobileMenuToggle={() => {}} />
          </AdminShellHeader>
          <AdminShellMain>
            <main className="flex-1 overflow-y-auto h-full">
              <div className="p-6 sm:p-8 lg:p-10 w-full max-w-full">
                {children}
              </div>
            </main>
          </AdminShellMain>
        </AdminShell>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#F7F5EF] to-[#EBE2C5]">
      <AdminShell sidebarWidth="260px">
        <AdminShellSidebar className={mobileMenuOpen ? 'translate-x-0' : ''}>
          <AdminSidebar 
            mobileOpen={mobileMenuOpen} 
            setMobileOpen={setMobileMenuOpen}
          />
        </AdminShellSidebar>
        <AdminShellHeader>
          <AdminTopbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </AdminShellHeader>
        <AdminShellMain>
          <main className="flex-1 overflow-y-auto h-full">
            <div className="p-6 sm:p-8 lg:p-10 w-full max-w-full">
              {children}
            </div>
          </main>
        </AdminShellMain>
      </AdminShell>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}