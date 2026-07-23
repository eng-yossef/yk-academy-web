import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-electric-blue text-white shadow-md shadow-electric-blue/25 hover:bg-electric-blue/90 hover:shadow-lg hover:shadow-electric-blue/30 active:scale-[0.98]",
        secondary:
          "bg-light-gray text-dark-blue hover:bg-light-gray/80 active:scale-[0.98]",
        outline:
          "border border-electric-blue/30 bg-transparent text-electric-blue hover:bg-electric-blue/5 active:scale-[0.98]",
        ghost:
          "text-dark-blue hover:bg-light-gray hover:text-electric-blue active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 active:scale-[0.98]",
        link:
          "text-electric-blue underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        default: "h-10 px-5 py-2",
        lg: "h-12 px-8 text-base rounded-xl",
        icon: "h-10 w-10 rounded-lg",
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
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={disabled || loading}
          {...props}
        >
          {loading && <Loader2 className="animate-spin" />}
          <Slottable>{children}</Slottable>
        </Comp>
      );
    }
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
