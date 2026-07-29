"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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
import {
  RefreshCw,
  Database,
  BarChart3,
  List,
  Trash2,
  Info,
  X,
  FilePlus,
  LayoutList,
  Trophy,
  AlertTriangle,
  KeyRound,
  CheckCircle,
} from "lucide-react";

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
  const [showGuide, setShowGuide] = useState(false);

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
          <div className="flex items-center gap-2">
            <NeonButton
              variant="ghost"
              size="sm"
              onClick={() => setShowGuide(true)}
            >
              <span className="flex items-center gap-1">
                <Info size={14} />
                Guide
              </span>
            </NeonButton>
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
        </div>

        {/* Question Form Section */}
        <CyberCard glow="pink" className="bg-white/[0.08] border-white/25 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 text-neon-pink sm:mb-6">
            <Database size={18} />
            <h2 className="font-display text-xs uppercase tracking-widest sm:text-sm">
              Question Deployer
            </h2>
          </div>
          <QuestionForm onQuestionCreated={handleQuestionCreated} />
        </CyberCard>

        {/* Deployed Questions Section */}
        <CyberCard glow="cyan" className="bg-white/[0.08] border-white/25 backdrop-blur-xl">
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
        <CyberCard glow="cyan" className="bg-white/[0.08] border-white/25 backdrop-blur-xl">
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
        <CyberCard glow="pink" className="bg-white/[0.08] border-white/25 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 text-red-400 sm:mb-6">
            <Trash2 size={18} />
            <h2 className="font-display text-xs uppercase tracking-widest sm:text-sm">
              Danger Zone
            </h2>
          </div>
          <p className="mb-4 text-xs text-white/70">
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

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="glass glow-pink mx-auto max-h-[90dvh] w-[95%] max-w-lg overflow-y-auto rounded-lg border border-white/30 bg-white/[0.12] p-4 backdrop-blur-2xl sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <div className="flex items-center gap-2 text-neon-pink">
                  <Info size={20} />
                  <h2 className="font-display text-sm font-bold uppercase tracking-widest">
                    Admin Guide
                  </h2>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="text-muted-steel transition-colors hover:text-ice-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-sm text-muted-steel sm:space-y-4">
                <GuideItem
                  icon={<KeyRound size={14} className="text-neon-cyan" />}
                  title="Admin Login"
                  desc="Enter the admin passkey to access this dashboard. Only authorized personnel can manage the quiz."
                />
                <GuideItem
                  icon={<FilePlus size={14} className="text-neon-cyan" />}
                  title="Question Deployer"
                  desc="Create new quiz questions. Enter the question text, four options (A-D), and select the correct answer. Click Deploy to save."
                />
                <GuideItem
                  icon={<LayoutList size={14} className="text-neon-cyan" />}
                  title="Deployed Questions"
                  desc="View all active questions. Click the expand arrow to see options and correct answer. Use the trash icon to delete a question."
                />
                <GuideItem
                  icon={<Trophy size={14} className="text-neon-cyan" />}
                  title="Live Leaderboard"
                  desc="See all player submissions ranked by score and speed. Top scores appear first. Time is used as a tiebreaker."
                />
                <GuideItem
                  icon={<AlertTriangle size={14} className="text-neon-pink" />}
                  title="Danger Zone"
                  desc="Permanently deletes ALL questions and leaderboard entries from the database. This action cannot be undone."
                />
                <GuideItem
                  icon={<CheckCircle size={14} className="text-green-400" />}
                  title="Tips"
                  desc="Use Refresh buttons to fetch latest data. Names are locked — no two players can use the same callsign. Questions support any language."
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GuideItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-2 rounded-md border border-muted-steel/10 bg-white/[0.02] p-2 sm:gap-3 sm:p-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="mb-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-ice-white sm:mb-1 sm:text-xs">
          {title}
        </p>
        <p className="text-[11px] leading-relaxed text-muted-steel/80 sm:text-xs">{desc}</p>
      </div>
    </div>
  );
}
