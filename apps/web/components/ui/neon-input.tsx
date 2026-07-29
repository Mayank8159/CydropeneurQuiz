"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface NeonInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClassName?: string;
  showPasswordToggle?: boolean;
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, error, labelClassName = "", className = "", showPasswordToggle, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className={`font-display text-xs uppercase tracking-normal text-muted-steel ${labelClassName}`}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={resolvedType}
            className={`
              w-full rounded-md border border-neon-cyan/20 bg-cyber-surface/50
              px-4 py-2.5 text-ice-white font-body
              outline-none transition-all duration-300
              focus:border-neon-cyan/60 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)]
              placeholder:text-muted-steel/50
              ${error ? "border-neon-pink/60" : ""}
              ${isPassword && showPasswordToggle ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />
          {isPassword && showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-steel transition-colors hover:text-ice-white"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
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
