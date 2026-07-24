"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="font-display text-xs uppercase tracking-widest text-muted-steel">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-md border border-neon-cyan/20 bg-cyber-surface/50
            px-4 py-2.5 text-ice-white font-body
            outline-none transition-all duration-300
            focus:border-neon-cyan/60 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)]
            placeholder:text-muted-steel/50
            ${error ? "border-neon-pink/60" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-neon-pink font-display tracking-wider">
            {error}
          </span>
        )}
      </div>
    );
  }
);

NeonInput.displayName = "NeonInput";
