import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#0E161B] text-[#EBE2C5] hover:bg-[#1A1814]",
        primary: "bg-[#CDB586] text-[#0E161B] hover:bg-[#EBE2C5] shadow-lg",
        secondary: "bg-[#F7F5EF] text-[#0E161B] hover:bg-[#EBE2C5]",
        outline: "border-2 border-[#CDB586] text-[#CDB586] hover:bg-[#CDB586] hover:text-[#0E161B]",
        ghost: "hover:bg-[#EBE2C5] text-[#0E161B]",
        link: "text-[#0E161B] underline-offset-4 hover:underline",
        whatsapp: "bg-[#0E161B] text-[#CDB586] border border-[#CDB586] hover:bg-[#1A1814] shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };