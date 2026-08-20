import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, subtitle, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-6 text-center",
      className
    )}>
      {icon && (
        <div className="h-16 w-16 rounded-full bg-[#CDB586]/10 flex items-center justify-center mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-[#0E161B] mb-2">{title}</h3>
      <p className="text-[#5F3C18] max-w-md mb-6">{subtitle}</p>
      {action && <div>{action}</div>}
    </div>
  );
}