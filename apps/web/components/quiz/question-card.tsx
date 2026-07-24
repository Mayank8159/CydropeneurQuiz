"use client";

import { motion, type Transition } from "motion/react";
import { OptionButton } from "./option-button";

interface QuestionCardProps {
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  selectedAnswer: string | null;
  onSelect: (letter: string) => void;
  disabled?: boolean;
}

const transition: Transition = { duration: 0.4, ease: "easeInOut" };

export function QuestionCard({
  qNumber,
  question,
  options,
  selectedAnswer,
  onSelect,
  disabled = false,
}: QuestionCardProps) {
  const letters = ["a", "b", "c", "d"] as const;

  return (
    <motion.div
      key={qNumber}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={transition}
      className="w-full max-w-2xl"
    >
      <div className="mb-1.5 font-display text-[10px] uppercase tracking-[0.2em] text-neon-cyan sm:mb-2 sm:text-xs">
        Question {qNumber}
      </div>
      <h2 className="mb-5 text-lg font-semibold leading-relaxed text-ice-white sm:mb-8 sm:font-display sm:text-xl md:text-2xl">
        {question}
      </h2>
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {letters.map((letter) => (
          <OptionButton
            key={letter}
            letter={letter}
            text={options[letter]}
            selected={selectedAnswer === letter}
            disabled={disabled}
            onClick={() => onSelect(letter)}
          />
        ))}
      </div>
    </motion.div>
  );
}
