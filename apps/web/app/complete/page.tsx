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
    <div className="flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="text-center flex flex-col items-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_25px_rgba(0,243,255,0.25)]">
            <CheckCircle2 size={36} />
          </div>
          <GlitchText
            text="SUBMISSION SUCCESSFUL"
            className="text-2xl font-bold tracking-wider text-neon-cyan text-glow-cyan sm:text-3xl"
          />
          <p className="mt-2 font-display text-xs uppercase tracking-[0.15em] text-white/80 sm:text-sm sm:tracking-[0.2em]">
            Thank you for participating, {result.playerName}
          </p>
          <p className="mt-1 text-xs text-white/60 font-sans">
            Your responses have been recorded successfully.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <CyberCard glow="cyan" className="bg-white/[0.08] border-white/20 backdrop-blur-xl py-8">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <div className="flex items-center gap-2 text-neon-cyan/80">
                <Clock size={18} />
                <span className="font-display text-xs uppercase tracking-widest text-white/70">
                  TOTAL TIME TAKEN
                </span>
              </div>
              <span className="font-display text-3xl font-bold text-neon-cyan sm:text-4xl tracking-wider text-glow-cyan">
                {formatTimeMs(result.timeElapsedMs)}
              </span>
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
              <Home size={16} />
              Return to Home
            </span>
          </NeonButton>
        </motion.div>
      </div>
    </div>
  );
}

