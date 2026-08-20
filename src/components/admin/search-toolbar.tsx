import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  actions?: ReactNode;
  filters?: ReactNode;
  className?: string;
}

export function SearchToolbar({ 
  searchPlaceholder = "Search...", 
  searchValue, 
  onSearchChange, 
  actions, 
  filters,
  className 
}: SearchToolbarProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6",
      className
    )}>
      <div className="flex-1 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5F3C18]/40" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-white border-[#CDB586]/30 text-[#0E161B] placeholder:text-[#5F3C18]/40 pl-11 focus:ring-2 focus:ring-[#CDB586]/50 focus:border-[#CDB586]/50 h-10 w-full"
          />
        </div>
      </div>
      {filters && <div className="flex items-center gap-2">{filters}</div>}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}