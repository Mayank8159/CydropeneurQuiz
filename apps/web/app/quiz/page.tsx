"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { HudBadge } from "@/components/ui/hud-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { NeonButton } from "@/components/ui/neon-button";
import { QuestionCard } from "@/components/quiz/question-card";
import { useTimer } from "@/hooks/use-timer";
import { fetchQuestions, submitQuiz } from "@/lib/api";
import { formatTimeMs } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Send, Flag, RotateCcw, Clock, LayoutGrid } from "lucide-react";

interface Question {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
}

const TOTAL_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

const formatRemainingTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
};

const formatTimeNoMs = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${mm}:${ss}`;
};

const getCategoryForQuestion = (qNumber: number): string => {
  const categories: Record<number, string> = {
    1: "Data Structures",
    2: "Data Structures",
    3: "Algorithms",
    4: "Algorithms",
    5: "Cybersecurity",
    6: "Cybersecurity",
    7: "Web Technology",
    8: "Web Technology",
    9: "Operating Systems",
    10: "Database Systems",
  };
  return categories[qNumber] || "General Tech";
};

export default function QuizPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<"server" | "empty" | "">("");

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => {
      setError("");
      setErrorType("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  // Grid Visited & Marked states
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Mobile overview drawer & swipe states
  const [isMobileGridOpen, setIsMobileGridOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientY;
    const distance = touchStart - touchEnd;

    // Only open if they swipe up from the bottom 30% of the screen
    const isFromBottom = touchStart > window.innerHeight * 0.7;
    const isSwipeUp = distance > 60;

    if (isSwipeUp && isFromBottom && window.innerWidth < 1024) {
      setIsMobileGridOpen(true);
    }
    setTouchStart(null);
  };

  const { elapsedMs, isRunning, start, stop } = useTimer();
  const remainingMs = Math.max(0, TOTAL_LIMIT_MS - elapsedMs);

  useEffect(() => {
    document.documentElement.classList.add("quiz-layout-locked");
    document.body.classList.add("quiz-layout-locked");
    document.body.classList.add("quiz-page-bg");

    return () => {
      document.documentElement.classList.remove("quiz-layout-locked");
      document.body.classList.remove("quiz-layout-locked");
      document.body.classList.remove("quiz-page-bg");
    };
  }, []);

  // Lock background scroll when mobile overview drawer is open
  useEffect(() => {
    if (isMobileGridOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isMobileGridOpen]);

  useEffect(() => {
    const name = sessionStorage.getItem("playerName");
    const email = sessionStorage.getItem("playerEmail");
    if (!name) {
      router.push("/");
      return;
    }
    setPlayerName(name);
    setPlayerEmail(email || "");

    fetchQuestions()
      .then((q) => {
        setQuestions(q);
        setLoading(false);
        if (q.length === 0) {
          setError("NO QUESTIONS ADDED // AWAITING QUESTION DEPLOYMENT");
          setErrorType("empty");
        } else {
          start();
        }
      })
      .catch(() => {
        setError("SERVER NOT CONNECTED // UNABLE TO REACH QUIZ MATRIX");
        setErrorType("server");
        setLoading(false);
      });
  }, [router, start]);

  const handleSelectAnswer = useCallback(
    (letter: string) => {
      const current = questions[currentIndex];
      if (!current) return;
      setAnswers((prev) => ({ ...prev, [current.qNumber]: letter }));
    },
    [questions, currentIndex]
  );

  const handleSubmit = useCallback(async () => {
    const time = stop();
    setSubmitting(true);
    try {
      const result = await submitQuiz({
        playerName,
        playerEmail,
        answers,
        timeElapsedMs: time,
      });
      sessionStorage.setItem(
        "quizResult",
        JSON.stringify({
          ...result,
          playerName,
          timeElapsedMs: time,
        })
      );
      router.push("/complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }, [playerName, answers, stop, router]);

  const handleConfirmSubmit = useCallback(async () => {
    setShowSubmitModal(false);
    await handleSubmit();
  }, [handleSubmit]);

  // Auto-submit on timer end
  useEffect(() => {
    if (questions.length > 0 && remainingMs <= 0 && isRunning && !submitting) {
      handleSubmit();
    }
  }, [remainingMs, isRunning, questions.length, submitting, handleSubmit]);

  const handleJump = useCallback((index: number) => {
    setCurrentIndex(index);
    setVisited((prev) => ({ ...prev, [index]: true }));
  }, []);

  const handleToggleMark = useCallback(() => {
    setMarked((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex],
    }));
  }, [currentIndex]);

  const handleClearSelection = useCallback(() => {
    const current = questions[currentIndex];
    if (!current) return;
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[current.qNumber];
      return copy;
    });
  }, [questions, currentIndex]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-neon-cyan border-t-transparent" />
          <p className="font-display text-sm uppercase tracking-widest text-neon-cyan">
            Loading Quiz Matrix...
          </p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    const isServer = errorType === "server";
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 ${isServer
              ? "border-neon-pink/40 bg-neon-pink/10"
              : "border-muted-steel/30 bg-muted-steel/5"
              }`}
          >
            <span className="font-display text-3xl font-bold text-muted-steel">
              {isServer ? "!" : "?"}
            </span>
          </div>
          <p
            className={`font-display text-sm font-bold tracking-wider sm:text-base ${isServer ? "text-neon-pink" : "text-muted-steel"
              }`}
          >
            {error}
          </p>
          <p className="font-body text-xs text-muted-steel/70 sm:text-sm">
            {isServer
              ? "Check your connection and try again."
              : "Ask the admin to deploy questions from the admin panel."}
          </p>
          <NeonButton onClick={() => router.push("/")} variant="ghost" size="sm">
            Return to Base
          </NeonButton>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.qNumber] || null
    : null;
  const isLastQuestion = currentIndex === questions.length - 1;

  // Legend Counters
  let answeredCount = 0;
  let markedCount = 0;
  let visitedUnansweredCount = 0;
  let notVisitedCount = 0;

  questions.forEach((q, idx) => {
    const qNum = q.qNumber;
    const isMarked = !!marked[idx];
    const isAnswered = !!answers[qNum];
    const isVisited = !!visited[idx];

    if (isMarked) {
      markedCount++;
    } else if (isAnswered) {
      answeredCount++;
    } else if (isVisited) {
      visitedUnansweredCount++;
    } else {
      notVisitedCount++;
    }
  });

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="flex lg:h-dvh min-h-dvh flex-col select-none"
    >
      {/* HUD Header */}
      <header className="glass sticky top-0 z-40 border-b border-neon-cyan/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-2.5">
          <div className="flex items-center gap-4 sm:gap-5">
            <Image
              src="/logo.png"
              alt="CYDROPRENEUR"
              width={220}
              height={55}
              className="h-auto w-auto max-w-[140px] sm:max-w-[190px] object-contain"
              priority
            />
            <div className="h-8 sm:h-10 w-[1.5px] bg-white/20 shrink-0" />
            <Image
              src="/title.png"
              alt="Quiz Title"
              width={250}
              height={60}
              className="h-auto w-auto max-w-[160px] sm:max-w-[210px] object-contain shrink-0"
              priority
            />
          </div>
          <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:items-center sm:gap-4 sm:w-auto text-[9px] sm:text-xs font-display tracking-widest">
            <div className="text-center sm:text-right shrink-0 flex items-center justify-center sm:justify-end gap-1 min-w-0">
              <span className="text-white/40">PLAYER:</span>
              <span className="text-neon-cyan font-bold uppercase truncate max-w-[65px] sm:max-w-[95px]" title={playerName}>
                {playerName}
              </span>
            </div>
            <div className="text-center sm:text-right shrink-0">
              <span className="text-white/40">SCORE:</span>
              <span className="text-neon-pink font-bold ml-1">
                {Object.keys(answers).length}/{questions.length}
              </span>
            </div>
            <div className="text-center sm:text-right shrink-0 tabular-nums">
              <span className="text-white/40">TIME:</span>
              <span className="text-neon-cyan font-bold ml-1">
                {formatTimeNoMs(elapsedMs)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 overflow-y-auto px-3 py-3 sm:px-4 md:px-6 md:py-4 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] xl:grid-cols-[1fr_290px] gap-4 sm:gap-6 items-start">

          {/* Left Column (80%): Question & Actions */}
          <div className="space-y-4">

            {/* Sub-Header Area */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-display uppercase tracking-widest text-neon-cyan border border-neon-cyan/20 bg-neon-cyan/5">
                  Category: {getCategoryForQuestion(currentQuestion?.qNumber || 1)}
                </span>
              </div>
              <div>
                <button
                  onClick={handleToggleMark}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md border-2 font-display text-[10px] uppercase tracking-wider transition-all duration-300 ${marked[currentIndex]
                    ? "border-purple-500 bg-purple-600/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                    : "border-white/10 bg-transparent text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                >
                  <Flag size={12} className={marked[currentIndex] ? "fill-current" : ""} />
                  Mark for Review
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-display text-[10px] tracking-widest text-white/50">
                <span>PROGRESS</span>
                <span>{Object.keys(answers).length} / {questions.length}</span>
              </div>
              <ProgressBar current={Object.keys(answers).length} total={questions.length} />
            </div>

            {/* Question Card (Translucent Glass Container) */}
            <div className="bg-black/50 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-display text-[10px] tracking-widest text-white/40 uppercase">
                  Question {currentQuestion?.qNumber} of {questions.length}
                </span>

                {/* Clear Selection Button */}
                {currentAnswer && (
                  <button
                    onClick={handleClearSelection}
                    className="flex items-center gap-1.5 text-[10px] font-display uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                  >
                    <RotateCcw size={10} />
                    Clear Selection
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {currentQuestion && (
                  <QuestionCard
                    key={currentQuestion.qId}
                    qNumber={currentQuestion.qNumber}
                    question={currentQuestion.question}
                    options={currentQuestion.options}
                    selectedAnswer={currentAnswer}
                    onSelect={handleSelectAnswer}
                    disabled={submitting}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-1">
              <NeonButton
                variant="ghost"
                size="sm"
                onClick={() => handleJump(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0 || submitting}
              >
                <span className="flex items-center gap-1">
                  <ChevronLeft size={16} />
                  <span>Prev</span>
                </span>
              </NeonButton>

              {/* Mobile Overview Trigger Button */}
              <button
                onClick={() => setIsMobileGridOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-md border-2 border-neon-cyan/50 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/15 hover:border-neon-cyan font-display text-[9px] uppercase tracking-wider transition-all duration-300 shadow-[0_0_10px_rgba(0,243,255,0.1)]"
              >
                <LayoutGrid size={12} />
                <span>Overview</span>
              </button>

              {isLastQuestion ? (
                <NeonButton
                  variant="pink"
                  size="sm"
                  onClick={() => setShowSubmitModal(true)}
                  loading={submitting}
                >
                  <span className="flex items-center gap-1">
                    <Send size={16} />
                    <span>Submit</span>
                  </span>
                </NeonButton>
              ) : (
                <NeonButton
                  variant="cyan"
                  size="sm"
                  onClick={() => handleJump(Math.min(questions.length - 1, currentIndex + 1))}
                  disabled={submitting}
                >
                  <span className="flex items-center gap-1">
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </span>
                </NeonButton>
              )}
            </div>

          </div>

          {/* Right Column (20%): Glassmorphic Sidebar Grid (Hidden on mobile/tablet) */}
          <div className="hidden lg:block lg:sticky lg:top-0 bg-black/50 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-4 shadow-2xl space-y-4">

            {/* Timer Widget */}
            <div className="text-center border-b border-white/10 pb-2.5">
              <div className="flex items-center justify-center gap-2 text-white/50 text-[10px] font-display uppercase tracking-widest mb-1">
                <Clock size={12} className="text-neon-cyan" />
                Remaining Time
              </div>
              <div className="font-display text-lg tracking-wider text-neon-cyan text-glow-cyan">
                {formatRemainingTime(remainingMs)}
              </div>
            </div>

            {/* Legends List */}
            <div>
              <h3 className="font-display text-[10px] uppercase tracking-widest text-white/40 mb-2">
                Status Legends
              </h3>
              <div className="grid grid-cols-1 gap-1.5 text-[9px] uppercase font-display tracking-widest">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 bg-white/5 border border-white/20 rounded shrink-0" />
                  <span className="text-white/60">Not Visited ({notVisitedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 bg-red-600/60 border border-red-500 rounded shrink-0" />
                  <span className="text-red-400">Not Answered ({visitedUnansweredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 bg-green-600/60 border border-green-500 rounded shrink-0" />
                  <span className="text-green-400">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 bg-purple-600/60 border border-purple-500 rounded shrink-0" />
                  <span className="text-purple-400">Review ({markedCount})</span>
                </div>
              </div>
            </div>

            {/* Matrix Numbers List */}
            <div>
              <h3 className="font-display text-[10px] uppercase tracking-widest text-white/40 mb-2">
                Question Grid
              </h3>
              <div className="grid grid-cols-3 gap-2 justify-items-center mb-4">
                {questions.map((q, idx) => {
                  const isMarked = !!marked[idx];
                  const isAnswered = !!answers[q.qNumber];
                  const isVisited = !!visited[idx];
                  const isActive = currentIndex === idx;

                  let btnColor = "bg-white/5 border-white/20 text-white/70 hover:bg-white/10";
                  if (isMarked) {
                    btnColor = "bg-purple-600/60 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:bg-purple-500/75";
                  } else if (isAnswered) {
                    btnColor = "bg-green-600/60 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-green-500/75";
                  } else if (isVisited) {
                    btnColor = "bg-red-600/60 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:bg-red-500/75";
                  }

                  return (
                    <button
                      key={q.qId}
                      onClick={() => handleJump(idx)}
                      className={`h-9 w-9 flex items-center justify-center rounded-md font-display text-[10px] border-2 transition-all duration-300 ${btnColor} ${isActive ? "ring-2 ring-white border-white scale-110" : ""
                        }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Premature Submit Button */}
            <div className="pt-2.5 border-t border-white/10">
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
                className="w-full py-1.5 rounded-lg border-2 border-neon-pink/50 bg-neon-pink/5 text-neon-pink hover:bg-neon-pink/15 hover:border-neon-pink font-display text-[9px] uppercase tracking-widest transition-all duration-300 shadow-[0_0_12px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]"
              >
                Submit Quiz Early
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Mobile Draggable Drawer (Quiz Overview Bottom Sheet) */}
      <AnimatePresence>
        {isMobileGridOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileGridOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Sliding Bottom Sheet */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.8 }}
              onDragEnd={(event, info) => {
                // If dragged down past a threshold (100px), close it
                if (info.offset.y > 100) {
                  setIsMobileGridOpen(false);
                }
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-10 w-full max-h-[85vh] bg-black/95 backdrop-blur-2xl border-t-2 border-white/20 rounded-t-3xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-y-auto"
            >
              {/* Drag Handle Bar */}
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 shrink-0 cursor-grab active:cursor-grabbing" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 shrink-0">
                <h2 className="font-display text-[10px] uppercase tracking-widest text-neon-cyan">
                  Quiz Overview
                </h2>
                <button
                  onClick={() => setIsMobileGridOpen(false)}
                  className="flex items-center justify-center p-1.5 rounded-md border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="space-y-5 flex-1 min-h-0">

                {/* Timer Widget */}
                <div className="text-center border-b border-white/10 pb-4">
                  <div className="flex items-center justify-center gap-2 text-white/50 text-[9px] font-display uppercase tracking-widest mb-1">
                    <Clock size={12} className="text-neon-cyan" />
                    Remaining Time
                  </div>
                  <div className="font-display text-base tracking-wider text-neon-cyan text-glow-cyan">
                    {formatRemainingTime(remainingMs)}
                  </div>
                </div>

                {/* Legends Panel */}
                <div>
                  <h3 className="font-display text-[9px] uppercase tracking-widest text-white/40 mb-2">
                    Status Legends
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-[8px] uppercase font-display tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 bg-white/5 border border-white/20 rounded shrink-0" />
                      <span className="text-white/60 truncate">Not Visited ({notVisitedCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 bg-red-600/60 border border-red-500 rounded shrink-0" />
                      <span className="text-red-400 truncate">Not Answered ({visitedUnansweredCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 bg-green-600/60 border border-green-500 rounded shrink-0" />
                      <span className="text-green-400 truncate">Answered ({answeredCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 bg-purple-600/60 border border-purple-500 rounded shrink-0" />
                      <span className="text-purple-400 truncate">Review ({markedCount})</span>
                    </div>
                  </div>
                </div>

                {/* Question Grid Matrix */}
                <div>
                  <h3 className="font-display text-[9px] uppercase tracking-widest text-white/40 mb-2">
                    Question Grid
                  </h3>
                  <div className="grid grid-cols-5 gap-2 justify-items-center">
                    {questions.map((q, idx) => {
                      const isMarked = !!marked[idx];
                      const isAnswered = !!answers[q.qNumber];
                      const isVisited = !!visited[idx];
                      const isActive = currentIndex === idx;

                      let btnColor = "bg-white/5 border-white/20 text-white/70 hover:bg-white/10";
                      if (isMarked) {
                        btnColor = "bg-purple-600/60 border-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:bg-purple-500/75";
                      } else if (isAnswered) {
                        btnColor = "bg-green-600/60 border-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-green-500/75";
                      } else if (isVisited) {
                        btnColor = "bg-red-600/60 border-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:bg-red-500/75";
                      }

                      return (
                        <button
                          key={q.qId}
                          onClick={() => {
                            handleJump(idx);
                            setIsMobileGridOpen(false);
                          }}
                          className={`h-8 w-8 flex items-center justify-center rounded-md font-display text-[9px] border-2 transition-all duration-300 ${btnColor} ${isActive ? "ring-2 ring-white border-white scale-110" : ""
                            }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Submit Button in Drawer Footer */}
              <div className="pt-3 border-t border-white/10 mt-4 shrink-0">
                <button
                  onClick={() => {
                    setIsMobileGridOpen(false);
                    setShowSubmitModal(true);
                  }}
                  disabled={submitting}
                  className="w-full py-2 rounded-lg border-2 border-neon-pink/50 bg-neon-pink/5 text-neon-pink hover:bg-neon-pink/15 hover:border-neon-pink font-display text-[9px] uppercase tracking-widest transition-all duration-300 shadow-[0_0_12px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.35)]"
                >
                  Submit Quiz Early
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-black/85 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-4 text-center"
            >
              <h3 className="font-display text-sm tracking-wider text-neon-pink uppercase">
                Confirm Submission
              </h3>

              <p className="font-sans text-xs text-white/70 leading-relaxed">
                Are you sure you want to submit your quiz? <br />
                You have answered <span className="text-neon-cyan font-bold font-display text-xs">{Object.keys(answers).length}</span> out of <span className="text-neon-cyan font-bold font-display text-xs">{questions.length}</span> questions.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 py-2 border-2 border-white/10 hover:border-white/20 rounded-lg text-[9px] font-display uppercase tracking-widest text-white/60 hover:text-white transition-all bg-transparent"
                >
                  No, Resume
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={submitting}
                  className="flex-1 py-2 border-2 border-neon-pink bg-neon-pink/15 hover:bg-neon-pink/35 rounded-lg text-[9px] font-display uppercase tracking-widest text-neon-pink hover:text-white transition-all shadow-[0_0_12px_rgba(244,63,94,0.15)]"
                >
                  {submitting ? "Submitting..." : "Yes, Submit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submit Error */}
      {error && (
        <div className="fixed bottom-20 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2">
          <div className="rounded-md border border-neon-pink/40 bg-neon-pink/10 px-4 py-3 text-center font-display text-xs text-neon-pink backdrop-blur-md sm:px-6 sm:py-3 sm:text-sm">
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
