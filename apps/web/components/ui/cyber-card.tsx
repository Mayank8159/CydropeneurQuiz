"use client";

import { motion, type Transition } from "motion/react";
import { type ReactNode } from "react";

interface CyberCardProps {
  children: ReactNode;
  className?: string;
  glow?: "cyan" | "pink" | "none";
  animate?: boolean;
}

const transition: Transition = { duration: 0.5, ease: "easeOut" };

export function CyberCard({
  children,
  className = "",
  glow = "cyan",
  animate = true,
}: CyberCardProps) {
  const glowClasses = {
    cyan: "glow-cyan",
    pink: "glow-pink",
    none: "",
  };

  return (
    <motion.div
      className={`glass rounded-lg border-glow-cyan p-6 ${glowClasses[glow]} ${className}`}
      {...(animate
        ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition,
          }
        : {})}
    >
      {children}
    </motion.div>
  );
}
