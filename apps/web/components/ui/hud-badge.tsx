"use client";

interface HudBadgeProps {
  label: string;
  value: string | number;
  variant?: "cyan" | "pink";
  className?: string;
}

export function HudBadge({
  label,
  value,
  variant = "cyan",
  className = "",
}: HudBadgeProps) {
  const variantStyles = {
    cyan: {
      border: "border-neon-cyan/30",
      text: "text-neon-cyan",
      bg: "bg-neon-cyan/5",
    },
    pink: {
      border: "border-neon-pink/30",
      text: "text-neon-pink",
      bg: "bg-neon-pink/5",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} border
        rounded-md px-4 py-2
        flex flex-col items-center gap-0.5
        font-display
        ${className}
      `}
    >
      <span className="text-[10px] uppercase tracking-widest text-muted-steel">
        {label}
      </span>
      <span className={`text-lg font-bold ${styles.text}`}>{value}</span>
    </div>
  );
}
