"use client";

import { motion } from "motion/react";
import { type Transition } from "motion/react";

interface OptionButtonProps {
  letter: "a" | "b" | "c" | "d";
  text: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const transition: Transition = { duration: 0.4, ease: "easeInOut" };

export function OptionButton({
  letter,
  text,
  selected,
  disabled = false,
  onClick,
}: OptionButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={transition}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left rounded-lg border-2 p-3
        transition-all duration-300 font-sans text-base
        flex items-center gap-3
        disabled:cursor-not-allowed disabled:opacity-50
        sm:p-4 sm:gap-4 sm:text-base
        ${
          selected
            ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            : "border-muted-steel/20 bg-cyber-surface/30 text-ice-white hover:border-neon-cyan/40 hover:bg-neon-cyan/5"
        }
      `}
    >
      <span
        className={`
          flex h-8 w-8 shrink-0 items-center justify-center
          rounded-md font-display font-bold text-xs uppercase
          sm:h-10 sm:w-10 sm:text-sm
          ${
            selected
              ? "bg-neon-cyan text-cyber-bg"
              : "bg-cyber-surface border border-muted-steel/30 text-muted-steel"
          }
        `}
      >
        {letter}
      </span>
      <span className="flex-1">{text}</span>
    </motion.button>
  );
}
