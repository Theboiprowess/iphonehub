import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#0E161B] text-[#EBE2C5]",
        boxed: "bg-[#CDB586] text-[#0E161B] border border-[#0E161B]",
        preOwned: "bg-[#81592B] text-[#EBE2C5] border border-[#EBE2C5]",
        secondHand: "bg-[#5F3C18] text-[#EBE2C5] border border-[#EBE2C5]",
        secondary: "bg-[#F7F5EF] text-[#0E161B]",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-[#CDB586] text-[#CDB586]",
        sale: "bg-[#CDB586] text-[#0E161B]",
        new: "bg-[#81592B] text-[#EBE2C5]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
