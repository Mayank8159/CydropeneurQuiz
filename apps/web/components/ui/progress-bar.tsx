"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = "" }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-1 flex items-center justify-between font-display text-xs tracking-wider text-muted-steel">
        <span>PROGRESS</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-cyber-surface border border-neon-cyan/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
