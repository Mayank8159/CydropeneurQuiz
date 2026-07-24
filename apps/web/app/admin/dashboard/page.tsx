"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GlitchText } from "@/components/ui/glitch-text";
import { CyberCard } from "@/components/ui/cyber-card";
import { NeonButton } from "@/components/ui/neon-button";
import { QuestionForm } from "@/components/admin/question-form";
import { LeaderboardTable } from "@/components/admin/leaderboard-table";
import { fetchLeaderboard } from "@/lib/api";
import { RefreshCw, Database, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<
    Array<{
      rank: number;
      playerName: string;
      score: number;
      timeElapsedMs: number;
      submittedAt: string;
    }>
  >([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin");
      return;
    }
    loadLeaderboard();
  }, [router]);

  const loadLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    } catch {
      // Silently fail on leaderboard load
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  return (
    <div className="min-h-dvh px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <GlitchText
            text="ADMIN DASHBOARD"
            as="h1"
            className="text-xl font-bold tracking-wider text-neon-pink text-glow-pink sm:text-2xl"
          />
          <NeonButton
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("adminAuth");
              router.push("/admin");
            }}
          >
            Logout
          </NeonButton>
        </div>

        {/* Question Form Section */}
        <CyberCard glow="pink">
          <div className="mb-4 flex items-center gap-2 text-neon-pink sm:mb-6">
            <Database size={18} />
            <h2 className="font-display text-xs uppercase tracking-widest sm:text-sm">
              Question Deployer
            </h2>
          </div>
          <QuestionForm onQuestionCreated={loadLeaderboard} />
        </CyberCard>

        {/* Leaderboard Section */}
        <CyberCard glow="cyan">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex items-center gap-2 text-neon-cyan">
              <BarChart3 size={18} />
              <h2 className="font-display text-xs uppercase tracking-widest sm:text-sm">
                Live Leaderboard
              </h2>
            </div>
            <NeonButton
              variant="ghost"
              size="sm"
              onClick={loadLeaderboard}
              loading={loadingLeaderboard}
            >
              <span className="flex items-center gap-1">
                <RefreshCw size={14} />
                Refresh
              </span>
            </NeonButton>
          </div>
          <LeaderboardTable entries={leaderboard} />
        </CyberCard>
      </div>
    </div>
  );
}
