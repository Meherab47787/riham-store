"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-light tracking-[0.3em] uppercase transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-br from-gold via-gold-light to-gold-dark text-obsidian hover:opacity-90",
        destructive:
          "text-destructive border border-destructive/30 hover:bg-destructive/10",
        outline:
          "border border-primary/60 text-primary hover:bg-primary hover:text-primary-foreground",
        secondary:
          "border border-border text-foreground/50 hover:text-primary hover:border-primary/40",
        ghost: "text-foreground/40 hover:text-primary hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "px-8 py-3.5",
        sm: "px-5 py-2.5",
        lg: "px-12 py-4",
        xs: "px-3 py-1.5",
        icon: "h-9 w-9",
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
