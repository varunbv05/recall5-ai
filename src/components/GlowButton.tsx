import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const GlowButton = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          size === "sm" && "h-9 px-4 text-sm",
          size === "md" && "h-11 px-6 text-sm",
          size === "lg" && "h-14 px-8 text-base",
          variant === "primary" && "glow-button",
          variant === "ghost" &&
            "glass-card hover:bg-white/5 text-foreground",
          className,
        )}
        {...props}
      />
    );
  },
);
GlowButton.displayName = "GlowButton";