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
      <div className="h-screen w-screen overflow-hidden">
        <AdminShell sidebarWidth="260px">
          <AdminShellSidebar isOpen={false} onClose={() => {}}>
            <AdminSidebar mobileOpen={false} setMobileOpen={() => {}} />
          </AdminShellSidebar>
          <AdminShellHeader>
            <AdminTopbar onMobileMenuToggle={() => {}} />
          </AdminShellHeader>
          <AdminShellMain>
            <main className="flex-1 overflow-y-auto h-full">
              <div className="p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-full">
                {children}
              </div>
            </main>
          </AdminShellMain>
        </AdminShell>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AdminShell sidebarWidth="260px">
        <AdminShellSidebar 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)}
        >
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
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-full">
              {children}
            </div>
          </main>
        </AdminShellMain>
      </AdminShell>
    </div>
  );
}