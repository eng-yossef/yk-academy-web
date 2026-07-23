import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-electric-blue text-white",
        secondary:
          "border-transparent bg-light-gray text-dark-blue",
        outline:
          "border-electric-blue/20 text-electric-blue",
        destructive:
          "border-transparent bg-destructive/10 text-destructive",
        success:
          "border-transparent bg-emerald-50 text-emerald-700",
        warning:
          "border-transparent bg-amber-50 text-amber-700",
        info:
          "border-transparent bg-cyan/10 text-cyan",
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
