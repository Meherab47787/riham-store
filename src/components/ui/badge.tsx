import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase font-light transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/10 text-primary",
        secondary: "border-border bg-transparent text-foreground/40",
        destructive: "border-destructive/20 bg-destructive/5 text-destructive",
        success: "border-green-400/20 bg-green-400/5 text-green-400",
        warning: "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",
        outline: "border-border text-foreground/50 bg-transparent",
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
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
