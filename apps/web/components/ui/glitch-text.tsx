"use client";

import { motion, type Transition } from "motion/react";

interface GlitchTextProps {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  className?: string;
  animate?: boolean;
}

const transition: Transition = { duration: 0.6, ease: "easeOut" };

export function GlitchText({
  text,
  as: Tag = "h1",
  className = "",
  animate = true,
}: GlitchTextProps) {
  if (!animate) {
    return <Tag className={`font-display ${className}`}>{text}</Tag>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      className="relative"
    >
      <Tag className={`font-display relative z-10 ${className}`}>{text}</Tag>
      <Tag
        className={`font-display absolute inset-0 z-0 animate-glitch text-neon-cyan opacity-30 ${className}`}
        aria-hidden="true"
      >
        {text}
      </Tag>
    </motion.div>
  );
}
