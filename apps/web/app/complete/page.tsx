"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { GlitchText } from "@/components/ui/glitch-text";
import { CyberCard } from "@/components/ui/cyber-card";
import { NeonButton } from "@/components/ui/neon-button";
import { formatTimeMs } from "@/lib/utils";
import { Clock, CheckCircle2, Home } from "lucide-react";

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

  return (
    <div suppressHydrationWarning className="flex min-h-dvh items-end sm:items-center justify-center px-4 pt-30 pb-8 sm:pt-44 sm:pb-12 overflow-y-auto">
      <div suppressHydrationWarning className="w-full max-w-[320px] sm:max-w-[340px] space-y-4 mt-32 sm:mt-44 md:mt-52 mb-4">
        {/* Glassmorphic Card Container */}
        <div className="flex flex-col w-full rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-white/30 text-white bg-white/[0.12] backdrop-blur-2xl shadow-[0_0_40px_rgba(255,255,255,0.12)] items-center justify-center gap-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="text-center flex flex-col items-center w-full"
          >
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_25px_rgba(0,243,255,0.25)]">
              <CheckCircle2 size={22} />
            </div>
            <GlitchText
              text="SUBMISSION SUCCESSFUL"
              className="text-xs sm:text-sm font-bold tracking-wider text-neon-cyan text-glow-cyan"
            />
            <p className="mt-1.5 font-display text-[9px] sm:text-[10px] uppercase tracking-wider text-white/90 truncate max-w-full">
              Thank you for participating, {result.playerName}
            </p>
            <p className="mt-0.5 text-[9px] text-white/70 font-sans">
              Your responses have been recorded successfully.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="w-full"
          >
            <div className="bg-white/[0.08] border border-white/30 rounded-xl py-3 px-4 w-full backdrop-blur-xl shadow-[0_0_25px_rgba(0,243,255,0.2)]">
              <div className="flex flex-col items-center justify-center gap-1 text-center">
                <div className="flex items-center gap-1.5 text-neon-cyan/90">
                  <Clock size={14} />
                  <span className="font-display text-[9px] uppercase tracking-widest text-white/80">
                    TOTAL TIME TAKEN
                  </span>
                </div>
                <span className="font-display text-lg sm:text-xl font-bold text-neon-cyan tracking-wider text-glow-cyan">
                  {formatTimeMs(result.timeElapsedMs)}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex justify-center w-full"
          >
            <NeonButton
              variant="cyan"
              size="sm"
              onClick={() => {
                sessionStorage.clear();
                router.push("/");
              }}
              className="w-full text-xs py-2 h-9"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Home size={14} />
                Return to Home
              </span>
            </NeonButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

