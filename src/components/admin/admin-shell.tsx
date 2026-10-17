"use client";

import { ReactNode } from "react";

interface AdminShellProps {
  children: ReactNode;
  sidebarWidth?: string;
}

export function AdminShell({ children, sidebarWidth = "260px" }: AdminShellProps) {
  return (
    <div className="w-full h-screen overflow-hidden grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-[260px_1fr] lg:grid-rows-[auto_1fr] lg:grid-areas-[sidebar_header_sidebar_main]">
      {children}
    </div>
  );
}

interface AdminShellSidebarProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminShellSidebar({ children, isOpen = false, onClose }: AdminShellSidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div 
        className={`
          fixed left-0 top-0 z-50 h-full w-[260px] 
          bg-gradient-to-b from-[#0E161B] to-[#1A1A20] border-r border-[#CDB586]/20
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:transform-none lg:transition-none lg:z-auto
          lg:grid-area-[sidebar]
        `}
      >
        {children}
      </div>
    </>
  );
}

interface AdminShellHeaderProps {
  children: ReactNode;
}

export function AdminShellHeader({ children }: AdminShellHeaderProps) {
  return (
    <div className="overflow-hidden bg-[#F7F5EF] border-b border-[#CDB586]/30 lg:grid-area-[header]">
      {children}
    </div>
  );
}

interface AdminShellMainProps {
  children: ReactNode;
}

export function AdminShellMain({ children }: AdminShellMainProps) {
  return (
    <div className="overflow-hidden h-full bg-[#F7F5EF] lg:grid-area-[main]">
      {children}
    </div>
  );
}