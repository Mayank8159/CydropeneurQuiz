"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { NeonButton } from "@/components/ui/neon-button";
import { Trash2, ChevronDown, ChevronUp, Check, AlertTriangle } from "lucide-react";

interface AdminQuestion {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
}

interface QuestionListProps {
  questions: AdminQuestion[];
  onDelete: (qId: string) => Promise<void>;
  deleting: string | null;
}

export function QuestionList({ questions, onDelete, deleting }: QuestionListProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (questions.length === 0) {
    return (
      <div className="py-8 text-center font-display text-sm text-muted-steel">
        No questions deployed yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="font-display text-[10px] uppercase tracking-widest text-muted-steel sm:text-xs">
        {questions.length} question{questions.length !== 1 ? "s" : ""} deployed
      </div>
      <AnimatePresence>
        {questions.map((q) => {
          const isExpanded = expanded === q.qId;
          const isConfirming = confirmDelete === q.qId;
          const isDeleting = deleting === q.qId;

          return (
            <motion.div
              key={q.qId}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-lg border border-muted-steel/15 bg-cyber-surface/30"
            >
              {/* Question header row */}
              <div className="flex items-center gap-3 px-3 py-3 sm:px-4">
                <span className="shrink-0 font-display text-xs font-bold text-neon-cyan">
                  Q{q.qNumber}
                </span>
                <button
                  onClick={() => setExpanded(isExpanded ? null : q.qId)}
                  className="flex-1 text-left"
                >
                  <p className="truncate font-body text-sm text-ice-white">
                    {q.question}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="hidden items-center gap-1 font-display text-[10px] text-neon-cyan sm:flex">
                    <Check size={10} />
                    {q.correctAnswer.toUpperCase()}
                  </span>
                  <button
                    onClick={() => setExpanded(isExpanded ? null : q.qId)}
                    className="text-muted-steel transition-colors hover:text-ice-white"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="border-t border-muted-steel/10 px-3 py-3 sm:px-4">
                      {/* Options */}
                      <div className="mb-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {(["a", "b", "c", "d"] as const).map((letter) => (
                          <div
                            key={letter}
                            className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm ${
                              q.correctAnswer === letter
                                ? "bg-neon-cyan/10 text-neon-cyan"
                                : "text-muted-steel"
                            }`}
                          >
                            <span className="shrink-0 font-display text-[10px] font-bold uppercase">
                              {letter})
                            </span>
                            <span className="truncate">{q.options[letter]}</span>
                            {q.correctAnswer === letter && (
                              <Check size={12} className="shrink-0 text-neon-cyan" />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Delete action */}
                      <div className="flex items-center justify-end">
                        {isConfirming ? (
                          <div className="flex items-center gap-2">
                            <AlertTriangle size={14} className="text-neon-pink" />
                            <span className="font-display text-xs text-neon-pink">
                              Delete?
                            </span>
                            <NeonButton
                              variant="pink"
                              size="sm"
                              onClick={async () => {
                                await onDelete(q.qId);
                                setConfirmDelete(null);
                                setExpanded(null);
                              }}
                              loading={isDeleting}
                            >
                              Confirm
                            </NeonButton>
                            <NeonButton
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmDelete(null)}
                            >
                              Cancel
                            </NeonButton>
                          </div>
                        ) : (
                          <NeonButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDelete(q.qId)}
                          >
                            <span className="flex items-center gap-1 text-neon-pink">
                              <Trash2 size={12} />
                              Delete
                            </span>
                          </NeonButton>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
