import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps {
  children: ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = "gap-6",
  className 
}: ResponsiveGridProps) {
  const getGridCols = () => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    
    let classes = colsMap[cols.default || 1];
    if (cols.sm) classes += ` sm:${colsMap[cols.sm]}`;
    if (cols.md) classes += ` md:${colsMap[cols.md]}`;
    if (cols.lg) classes += ` lg:${colsMap[cols.lg]}`;
    if (cols.xl) classes += ` xl:${colsMap[cols.xl]}`;
    
    return classes;
  };

  const gridClasses = cn(
    "grid",
    getGridCols(),
    gap,
    className
  );

  return <div className={gridClasses}>{children}</div>;
}