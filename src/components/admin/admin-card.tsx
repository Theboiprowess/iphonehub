import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function AdminCard({ children, className, title, subtitle }: AdminCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-[#CDB586]/20 shadow-sm overflow-hidden",
      className
    )}>
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-[#CDB586]/10">
          {title && <h3 className="text-lg font-semibold text-[#0E161B]">{title}</h3>}
          {subtitle && <p className="text-sm text-[#5F3C18] mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}