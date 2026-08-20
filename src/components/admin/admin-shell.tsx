"use client";

import { ReactNode } from "react";

interface AdminShellProps {
  children: ReactNode;
  sidebarWidth?: string;
}

export function AdminShell({ children, sidebarWidth = "260px" }: AdminShellProps) {
  return (
    <div 
      className="w-full h-screen overflow-hidden"
      style={{ 
        display: 'grid',
        gridTemplateColumns: `${sidebarWidth} 1fr`,
        gridTemplateRows: 'auto 1fr',
        gridTemplateAreas: `
          "sidebar header"
          "sidebar main"
        `
      }}
    >
      {children}
    </div>
  );
}

interface AdminShellSidebarProps {
  children: ReactNode;
}

export function AdminShellSidebar({ children }: AdminShellSidebarProps) {
  return (
    <div className="overflow-hidden h-full lg:static fixed left-0 top-0 z-50 lg:z-auto transform -translate-x-full lg:translate-x-0 transition-transform duration-300 lg:transition-none" style={{ gridArea: 'sidebar' }}>
      {children}
    </div>
  );
}

interface AdminShellHeaderProps {
  children: ReactNode;
}

export function AdminShellHeader({ children }: AdminShellHeaderProps) {
  return (
    <div className="overflow-hidden" style={{ gridArea: 'header' }}>
      {children}
    </div>
  );
}

interface AdminShellMainProps {
  children: ReactNode;
}

export function AdminShellMain({ children }: AdminShellMainProps) {
  return (
    <div className="overflow-hidden h-full" style={{ gridArea: 'main' }}>
      {children}
    </div>
  );
}