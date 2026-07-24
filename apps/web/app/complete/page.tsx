"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { GlitchText } from "@/components/ui/glitch-text";
import { CyberCard } from "@/components/ui/cyber-card";
import { NeonButton } from "@/components/ui/neon-button";
import { formatTimeMs } from "@/lib/utils";
import { Trophy, Clock, Target, RotateCcw } from "lucide-react";

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeElapsedMs: number;
  rank: number;
  totalPlayers: number;
  playerName: string;
}

export default function CompletePage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("quizResult");
    if (!stored) {
      router.push("/");
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  if (!result) return null;

  const percentage =
    result.totalQuestions > 0
      ? Math.round((result.score / result.totalQuestions) * 100)
      : 0;

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6 sm:space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="text-center"
        >
          <GlitchText
            text="SESSION COMPLETE"
            className="text-2xl font-bold tracking-wider text-neon-cyan text-glow-cyan sm:text-3xl md:text-4xl"
          />
          <p className="mt-2 font-display text-xs uppercase tracking-[0.15em] text-muted-steel sm:text-sm sm:tracking-[0.2em]">
            Mission Report for {result.playerName}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <CyberCard glow="cyan">
            <div className="grid grid-cols-3 gap-2 text-center sm:gap-4">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <Trophy className="text-neon-pink" size={20} />
                <span className="font-display text-xl font-bold text-neon-pink sm:text-3xl">
                  {result.score}
                </span>
                <span className="font-display text-[8px] uppercase tracking-widest text-muted-steel sm:text-[10px]">
                  Score ({percentage}%)
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <Clock className="text-neon-cyan" size={20} />
                <span className="font-display text-base font-bold text-neon-cyan sm:text-3xl">
                  {formatTimeMs(result.timeElapsedMs)}
                </span>
                <span className="font-display text-[8px] uppercase tracking-widest text-muted-steel sm:text-[10px]">
                  Time
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <Target className="text-neon-cyan" size={20} />
                <span className="font-display text-xl font-bold text-neon-cyan sm:text-3xl">
                  #{result.rank}
                </span>
                <span className="font-display text-[8px] uppercase tracking-widest text-muted-steel sm:text-[10px]">
                  Rank / {result.totalPlayers}
                </span>
              </div>
            </div>
          </CyberCard>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex justify-center"
        >
          <NeonButton
            variant="cyan"
            onClick={() => {
              sessionStorage.clear();
              router.push("/");
            }}
          >
            <span className="flex items-center gap-2">
              <RotateCcw size={16} />
              New Session
            </span>
          </NeonButton>
        </motion.div>
      </div>
    </div>
  );
}
