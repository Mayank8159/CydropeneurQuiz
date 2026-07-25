"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GlitchText } from "@/components/ui/glitch-text";
import { CyberCard } from "@/components/ui/cyber-card";
import { NeonButton } from "@/components/ui/neon-button";
import { QuestionForm } from "@/components/admin/question-form";
import { QuestionList } from "@/components/admin/question-list";
import { LeaderboardTable } from "@/components/admin/leaderboard-table";
import {
  fetchLeaderboard,
  adminFetchAllQuestions,
  adminDeleteQuestion,
  adminClearData,
} from "@/lib/api";
import { RefreshCw, Database, BarChart3, List, Trash2 } from "lucide-react";

interface AdminQuestion {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState<string | null>(null);
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
  const [clearingData, setClearingData] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("adminAuth");
    if (!auth) {
      router.push("/admin");
      return;
    }
    loadQuestions();
    loadLeaderboard();
  }, [router]);

  const loadQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    try {
      const data = await adminFetchAllQuestions();
      setQuestions(data);
    } catch {
      // Silently fail
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  const loadLeaderboard = useCallback(async () => {
    setLoadingLeaderboard(true);
    try {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    } catch {
      // Silently fail
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  const handleDeleteQuestion = useCallback(
    async (qId: string) => {
      setDeletingQuestion(qId);
      try {
        await adminDeleteQuestion(qId);
        setQuestions((prev) => prev.filter((q) => q.qId !== qId));
      } catch {
        // Could show error toast here
      } finally {
        setDeletingQuestion(null);
      }
    },
    []
  );

  const handleQuestionCreated = useCallback(() => {
    loadQuestions();
    loadLeaderboard();
  }, [loadQuestions, loadLeaderboard]);

  const handleClearData = useCallback(async () => {
    setClearingData(true);
    try {
      await adminClearData();
      setQuestions([]);
      setLeaderboard([]);
      setShowClearConfirm(false);
    } catch {
    } finally {
      setClearingData(false);
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
          <QuestionForm onQuestionCreated={handleQuestionCreated} />
        </CyberCard>

        {/* Deployed Questions Section */}
        <CyberCard glow="cyan">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex items-center gap-2 text-neon-cyan">
              <List size={18} />
              <h2 className="font-display text-xs uppercase tracking-widest sm:text-sm">
                Deployed Questions
              </h2>
            </div>
            <NeonButton
              variant="ghost"
              size="sm"
              onClick={loadQuestions}
              loading={loadingQuestions}
            >
              <span className="flex items-center gap-1">
                <RefreshCw size={14} />
                Refresh
              </span>
            </NeonButton>
          </div>
          <QuestionList
            questions={questions}
            onDelete={handleDeleteQuestion}
            deleting={deletingQuestion}
          />
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

        {/* Danger Zone */}
        <CyberCard glow="pink">
          <div className="mb-4 flex items-center gap-2 text-red-400 sm:mb-6">
            <Trash2 size={18} />
            <h2 className="font-display text-xs uppercase tracking-widest sm:text-sm">
              Danger Zone
            </h2>
          </div>
          <p className="mb-4 text-xs text-white/50">
            This will permanently delete all questions and leaderboard entries from the database.
          </p>
          {!showClearConfirm ? (
            <NeonButton
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
            >
              <span className="flex items-center gap-1 text-red-400">
                <Trash2 size={14} />
                Clear All Data
              </span>
            </NeonButton>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-xs font-bold text-red-400">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={handleClearData}
                  loading={clearingData}
                >
                  <span className="text-red-400">Yes, delete everything</span>
                </NeonButton>
                <NeonButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </NeonButton>
              </div>
            </div>
          )}
        </CyberCard>
      </div>
    </div>
  );
}
