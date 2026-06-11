import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full bg-input border border-border px-3 py-2.5 text-sm text-foreground font-light placeholder:text-foreground/20 focus:outline-none focus:border-primary/40 transition-colors disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-not-allowed read-only:opacity-40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
