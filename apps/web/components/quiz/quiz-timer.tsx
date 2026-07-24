"use client";

import { useEffect, useState } from "react";
import { HudBadge } from "@/components/ui/hud-badge";
import { formatTimeMs } from "@/lib/utils";

interface QuizTimerProps {
  isRunning: boolean;
  elapsedMs: number;
}

export function QuizTimer({ isRunning, elapsedMs }: QuizTimerProps) {
  const [displayMs, setDisplayMs] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setDisplayMs(Date.now() - (elapsedMs > 0 ? Date.now() - elapsedMs : Date.now()));
    }, 10);

    return () => clearInterval(interval);
  }, [isRunning, elapsedMs]);

  return (
    <HudBadge
      label="Time"
      value={formatTimeMs(displayMs)}
      variant="cyan"
    />
  );
}
