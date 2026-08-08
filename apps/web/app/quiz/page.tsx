"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ProgressBar } from "@/components/ui/progress-bar";
import { NeonButton } from "@/components/ui/neon-button";
import { QuestionCard } from "@/components/quiz/question-card";
import { useTimer } from "@/hooks/use-timer";
import { fetchQuestions, submitQuiz } from "@/lib/api";
import { ChevronLeft, ChevronRight, Send, Flag, RotateCcw, Clock, LayoutGrid, ShieldAlert, Maximize, Lock } from "lucide-react";

interface Question {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
}

const TOTAL_LIMIT_MS = 20 * 60 * 1000; // 20 minutes

/**
 * Returns true for iOS Safari, Android Chrome, and other mobile browsers
 * where the Fullscreen API is unsupported or unreliable.
 */
const isMobileDevice = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return (
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 &&
      !window.matchMedia("(pointer: fine)").matches)
  );
};

const requestFullscreenMode = () => {
  // Fullscreen API is unsupported on iOS Safari and unreliable on Android
  if (isMobileDevice()) return;
  const elem = document.documentElement as any;
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch((err: any) => console.log("Fullscreen request error:", err));
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen().catch((err: any) => console.log("Webkit fullscreen request error:", err));
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen(); // Firefox desktop
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen(); // IE/Edge legacy
  }
};

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

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

  // Anti-cheating & Fullscreen states
  const [hasStarted, setHasStarted] = useState(false);
  const [violations, setViolations] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationReason, setViolationReason] = useState("");
  const [autoSubmitting, setAutoSubmitting] = useState(false);

  const lastViolationTimeRef = useRef<number>(0);
  const autoSubmittingRef = useRef<boolean>(false);
  const showViolationModalRef = useRef<boolean>(false);

  // Grid Visited & Marked states
  const [visited, setVisited] = useState<Record<number, boolean>>({ 0: true });
  const [marked, setMarked] = useState<Record<number, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Mobile overview drawer & swipe states
  const [isMobileGridOpen, setIsMobileGridOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Restore anti-cheating state from sessionStorage / localStorage on mount
  useEffect(() => {
    const savedViolations = parseInt(
      sessionStorage.getItem("quiz_violations") ||
        localStorage.getItem("quiz_violations") ||
        "0",
      10
    );
    const savedStarted =
      sessionStorage.getItem("quiz_has_started") === "true" ||
      localStorage.getItem("quiz_has_started") === "true";
    if (savedViolations > 0) {
      setViolations(savedViolations);
    }
    if (savedStarted) {
      setHasStarted(true);
      // Re-request fullscreen for players resuming after a page refresh.
      // This fires inside a useEffect which is considered a trusted context
      // on most desktop browsers.
      requestFullscreenMode();
    }
    if (savedViolations >= 3) {
      setAutoSubmitting(true);
      autoSubmittingRef.current = true;
    }
  }, []);

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

  const { elapsedMs, isRunning, start, startFrom, stop } = useTimer();
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
    const name =
      sessionStorage.getItem("playerName") ||
      localStorage.getItem("playerName");
    const email =
      sessionStorage.getItem("playerEmail") ||
      localStorage.getItem("playerEmail");
    if (!name) {
      router.push("/");
      return;
    }
    try {
      sessionStorage.setItem("playerName", name);
      localStorage.setItem("playerName", name);
      if (email) {
        sessionStorage.setItem("playerEmail", email);
        localStorage.setItem("playerEmail", email);
      }
    } catch (e) {
      console.warn("Storage sync error:", e);
    }

    setPlayerName(name);
    setPlayerEmail(email || "");

    fetchQuestions()
      .then((q) => {
        let finalQuestions = q;
        if (q.length > 0) {
          const savedOrder =
            sessionStorage.getItem("quiz_question_order") ||
            localStorage.getItem("quiz_question_order");
          if (savedOrder) {
            try {
              const orderIds = JSON.parse(savedOrder) as string[];
              const mapped = new Map(q.map((item) => [item.qId, item]));
              const ordered = orderIds
                .map((id) => mapped.get(id))
                .filter(Boolean) as typeof q;
              if (ordered.length === q.length) {
                finalQuestions = ordered;
              } else {
                finalQuestions = shuffleArray(q);
                const orderStr = JSON.stringify(finalQuestions.map((item) => item.qId));
                sessionStorage.setItem("quiz_question_order", orderStr);
                localStorage.setItem("quiz_question_order", orderStr);
              }
            } catch (e) {
              finalQuestions = shuffleArray(q);
              const orderStr = JSON.stringify(finalQuestions.map((item) => item.qId));
              sessionStorage.setItem("quiz_question_order", orderStr);
              localStorage.setItem("quiz_question_order", orderStr);
            }
          } else {
            finalQuestions = shuffleArray(q);
            const orderStr = JSON.stringify(finalQuestions.map((item) => item.qId));
            sessionStorage.setItem("quiz_question_order", orderStr);
            localStorage.setItem("quiz_question_order", orderStr);
          }
        }
        setQuestions(finalQuestions);
        setLoading(false);
        if (finalQuestions.length === 0) {
          setError("NO QUESTIONS ADDED // AWAITING QUESTION DEPLOYMENT");
          setErrorType("empty");
        } else {
          const savedStarted =
            sessionStorage.getItem("quiz_has_started") === "true" ||
            localStorage.getItem("quiz_has_started") === "true";
          if (savedStarted) {
            // Restore timer from the original start timestamp so a
            // page refresh does not grant the student a fresh 30 min window.
            const rawTs =
              sessionStorage.getItem("quiz_start_time") ||
              localStorage.getItem("quiz_start_time");
            const savedTs = rawTs ? parseInt(rawTs, 10) : 0;
            if (savedTs > 0) {
              startFrom(savedTs);
            } else {
              start(); // Fallback if timestamp is somehow missing
            }
          }
        }
      })
      .catch(() => {
        setError("SERVER NOT CONNECTED // UNABLE TO REACH QUIZ MATRIX");
        setErrorType("server");
        setLoading(false);
      });
  }, [router, start, startFrom]);

  const handleStartQuiz = useCallback(() => {
    requestFullscreenMode();
    setHasStarted(true);
    const quizStartTime = Date.now();
    try {
      sessionStorage.setItem("quiz_has_started", "true");
      localStorage.setItem("quiz_has_started", "true");
      sessionStorage.setItem("quiz_start_time", String(quizStartTime));
      localStorage.setItem("quiz_start_time", String(quizStartTime));
    } catch (e) {
      console.warn("Storage write error:", e);
    }
    start();
  }, [start]);

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
      sessionStorage.removeItem("quiz_violations");
      sessionStorage.removeItem("quiz_has_started");
      sessionStorage.removeItem("quiz_start_time");
      sessionStorage.removeItem("quiz_question_order");
      localStorage.removeItem("quiz_violations");
      localStorage.removeItem("quiz_has_started");
      localStorage.removeItem("quiz_start_time");
      localStorage.removeItem("quiz_question_order");
    } catch (e) {
      console.warn("Storage cleanup error:", e);
    }
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
  }, [playerName, playerEmail, answers, stop, router]);

  const triggerViolation = useCallback(
    (reason: string) => {
      if (autoSubmittingRef.current) return;
      if (showViolationModalRef.current) return; // Prevent double counting while modal is already active

      const now = Date.now();
      if (now - lastViolationTimeRef.current < 2500) {
        return; // 2.5-second cooldown guard
      }
      lastViolationTimeRef.current = now;

      setViolations((prev) => {
        const next = prev + 1;
        try {
          sessionStorage.setItem("quiz_violations", String(next));
          localStorage.setItem("quiz_violations", String(next));
        } catch (e) {
          console.warn("Storage error:", e);
        }

        if (next >= 3) {
          setAutoSubmitting(true);
          autoSubmittingRef.current = true;
          setViolationReason(reason);
          handleSubmit();
        } else {
          setViolationReason(reason);
          setShowViolationModal(true);
          showViolationModalRef.current = true;
        }
        return next;
      });
    },
    [handleSubmit]
  );

  const handleResumeFromViolation = useCallback(() => {
    requestFullscreenMode();
    setShowViolationModal(false);
    showViolationModalRef.current = false;
    lastViolationTimeRef.current = Date.now();
  }, []);

  // Anti-cheating event listeners
  useEffect(() => {
    if (!hasStarted || submitting || autoSubmittingRef.current) return;

    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      const fullscreenSupported = !!(
        document.fullscreenEnabled ||
        (document as any).webkitFullscreenEnabled ||
        (document as any).mozFullScreenEnabled ||
        (document as any).msFullscreenEnabled
      );
      // On mobile the Fullscreen API is unsupported; never raise a violation
      // for fullscreen exit because fullscreen was never entered.
      const onMobile = isMobileDevice();

      if (isFullscreen || onMobile) {
        setShowViolationModal(false);
        showViolationModalRef.current = false;
      } else if (fullscreenSupported && !onMobile) {
        triggerViolation("Exited Fullscreen Mode");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation("Switched Tab or Minimized Window");
      }
    };

    const handleBlur = () => {
      // Only count if the page is still visible — prevents double-counting
      // with visibilitychange when a student switches tabs (both fire otherwise).
      if (!document.hidden) {
        triggerViolation("Window Focus Lost / Tab Switched");
      }
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handlePaste = (e: ClipboardEvent) => e.preventDefault();
    const handleCut = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "U"))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasStarted, submitting, triggerViolation]);

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

  // Pre-Quiz "Start quiz" Screen
  if (!hasStarted && questions.length > 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-lg glass border-2 border-neon-cyan/30 rounded-2xl p-5 sm:p-8 shadow-[0_0_40px_rgba(0,243,255,0.15)] text-white space-y-6 my-auto">
          {/* Branding Header */}
          <div className="flex flex-col items-center justify-center gap-3 text-center border-b border-white/10 pb-5">
            <Image
              src="/logo.png"
              alt="CYDROPRENEUR"
              width={220}
              height={55}
              className="h-auto w-auto max-w-[180px] sm:max-w-[220px] object-contain"
              priority
            />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-display uppercase tracking-widest text-neon-cyan border border-neon-cyan/30 bg-neon-cyan/10">
              <ShieldAlert size={14} />
              <span>Anti-Cheating Secure Environment</span>
            </div>
          </div>

          {/* Player Info */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-display tracking-wide space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-white/50 uppercase">PLAYER:</span>
              <span className="text-neon-cyan font-bold truncate max-w-[180px] sm:max-w-[240px]">
                {playerName}
              </span>
            </div>
            {playerEmail && (
              <div className="flex justify-between items-center">
                <span className="text-white/50 uppercase">EMAIL:</span>
                <span className="text-white/80 font-mono text-[11px] truncate max-w-[180px] sm:max-w-[240px]">
                  {playerEmail}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-white/50 uppercase">QUESTIONS:</span>
              <span className="text-neon-pink font-bold">{questions.length} Items</span>
            </div>
          </div>

          {/* Rules Section */}
          <div className="space-y-3">
            <h3 className="font-display text-xs uppercase tracking-widest text-white/70">
              Exam Security Instructions
            </h3>
            <ul className="space-y-2.5 text-xs text-white/80 leading-relaxed font-sans">
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong className="text-white font-display">Fullscreen Mode Required:</strong> The quiz will launch in fullscreen. Exiting fullscreen will flag a violation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong className="text-white font-display">No Tab Switching:</strong> Minimizing the window or switching browser tabs is strictly monitored.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-neon-pink/20 border border-neon-pink text-neon-pink flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong className="text-neon-pink font-display">3-Strike Auto-Submit Policy:</strong> Accumulating 3 violations will immediately auto-submit your quiz.
                </span>
              </li>
            </ul>
          </div>

          {/* Mobile Note */}
          <p className="text-[10px] sm:text-xs text-white/40 italic text-center font-sans border-t border-white/10 pt-3">
            Mobile users: Mute notifications and avoid swipe-to-exit gestures during your attempt.
          </p>

          {/* Start Quiz Action */}
          <div className="pt-2">
            <NeonButton
              variant="cyan"
              size="lg"
              onClick={handleStartQuiz}
              className="w-full flex items-center justify-center gap-2 text-sm sm:text-base py-3"
            >
              <Maximize size={18} />
              <span>Enter Full Screen & Start Quiz</span>
            </NeonButton>
          </div>
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
      <main className="flex-1 min-h-0 overflow-y-auto px-3 py-3 sm:px-4 md:px-6 md:py-4 mx-auto w-full max-w-7xl">
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
                  Question {currentIndex + 1} of {questions.length}
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
                    qNumber={currentIndex + 1}
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

      {/* Security Violation Lockscreen Modal */}
      <AnimatePresence>
        {showViolationModal && !autoSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-black/90 border-2 border-neon-pink/70 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(255,0,85,0.35)] text-center space-y-4 my-auto"
            >
              <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 border-neon-pink/50 bg-neon-pink/15 text-neon-pink animate-pulse">
                <ShieldAlert size={28} className="sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-sm sm:text-base font-bold tracking-wider text-neon-pink uppercase">
                  SECURITY VIOLATION DETECTED
                </h3>
                <p className="font-display text-[10px] sm:text-xs text-white/50 uppercase tracking-widest">
                  Exam Workspace Locked
                </p>
              </div>

              <div className="bg-neon-pink/10 border border-neon-pink/30 rounded-xl p-3 text-xs font-sans text-white/90 space-y-2">
                <p className="font-semibold text-neon-pink font-display text-[11px] sm:text-xs">
                  REASON: {violationReason.toUpperCase()}
                </p>
                <div className="flex items-center justify-between border-t border-neon-pink/20 pt-2 font-display text-[10px] sm:text-xs">
                  <span className="text-white/60">VIOLATIONS COUNT:</span>
                  <span className="text-neon-pink font-bold">{violations} / 3</span>
                </div>
                <div className="flex items-center justify-between font-display text-[10px] sm:text-xs">
                  <span className="text-white/60">CHANCES REMAINING:</span>
                  <span className="text-neon-cyan font-bold">{3 - violations}</span>
                </div>
              </div>

              <p className="font-sans text-xs text-white/70 leading-relaxed">
                You must return to fullscreen mode to resume your quiz. Switched tabs or exited fullscreen count towards auto-submission limit.
              </p>

              <div className="pt-2">
                <NeonButton
                  variant="pink"
                  size="md"
                  onClick={handleResumeFromViolation}
                  className="w-full flex items-center justify-center gap-2 text-xs sm:text-sm py-2.5"
                >
                  <Maximize size={16} />
                  <span>Restore Fullscreen</span>
                </NeonButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auto-Submitting Protocol Overlay */}
      <AnimatePresence>
        {autoSubmitting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-black border-2 border-red-600 rounded-2xl p-6 shadow-[0_0_60px_rgba(220,38,38,0.6)] text-center space-y-5 my-auto"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-red-500/20 text-red-500 animate-spin">
                <Lock size={32} />
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-base sm:text-lg font-bold tracking-wider text-red-500 uppercase">
                  TERMINATION PROTOCOL ACTIVATED
                </h3>
                <p className="font-display text-xs text-red-400/80 uppercase tracking-widest">
                  3 Security Violations Reached
                </p>
              </div>

              <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed">
                You have exceeded the maximum allowed tab-switches or fullscreen exits. Your quiz answers are now being automatically finalized and submitted.
              </p>

              <div className="flex items-center justify-center gap-2 text-neon-cyan font-display text-xs tracking-widest pt-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-neon-cyan border-t-transparent" />
                <span>FINALIZING SUBMISSION...</span>
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
