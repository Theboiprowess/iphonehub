import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-[#CDB586]/20 shadow-sm p-6 hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#5F3C18]">{title}</p>
          <p className="text-3xl font-bold text-[#0E161B] mt-2">{value}</p>
          {subtitle && <p className="text-sm text-[#5F3C18]/70 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="h-12 w-12 rounded-lg bg-[#CDB586]/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}