"use client";

import { motion } from "motion/react";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "pink" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  (
    {
      children,
      variant = "cyan",
      size = "md",
      loading = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      cyan: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]",
      pink: "border-neon-pink text-neon-pink hover:bg-neon-pink/10 hover:shadow-[0_0_20px_rgba(255,0,85,0.4)]",
      ghost: "border-muted-steel text-muted-steel hover:border-ice-white hover:text-ice-white",
    };

    const sizeClasses = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={`
          font-display font-semibold uppercase tracking-wider
          border-2 rounded-md transition-all duration-300
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

NeonButton.displayName = "NeonButton";
