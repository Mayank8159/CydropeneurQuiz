"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { HudBadge } from "@/components/ui/hud-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { NeonButton } from "@/components/ui/neon-button";
import { QuestionCard } from "@/components/quiz/question-card";
import { useTimer } from "@/hooks/use-timer";
import { fetchQuestions, submitQuiz } from "@/lib/api";
import { formatTimeMs } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

interface Question {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
}

export default function QuizPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { elapsedMs, isRunning, start, stop } = useTimer();

  useEffect(() => {
    const name = sessionStorage.getItem("playerName");
    if (!name) {
      router.push("/");
      return;
    }
    setPlayerName(name);

    fetchQuestions()
      .then((q) => {
        setQuestions(q);
        setLoading(false);
        start();
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load questions");
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

  const handleSubmit = async () => {
    const time = stop();
    setSubmitting(true);
    try {
      const result = await submitQuiz({
        playerName,
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
  };

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
    return (
      <div className="flex min-h-dvh items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4 font-display text-lg text-neon-pink">{error}</p>
          <NeonButton onClick={() => router.push("/")} variant="ghost">
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
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* HUD Header */}
      <header className="glass sticky top-0 z-40 border-b border-neon-cyan/10">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4 sm:py-3">
          <div className="font-display text-xs font-bold tracking-wider text-neon-cyan sm:text-sm">
            CYDROPENEUR
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <HudBadge label="Player" value={playerName} variant="cyan" className="hidden sm:flex" />
            <HudBadge
              label="Score"
              value={`${answeredCount}/${questions.length}`}
              variant="pink"
            />
            <HudBadge
              label="Time"
              value={formatTimeMs(elapsedMs)}
              variant="cyan"
            />
          </div>
        </div>
        <ProgressBar current={answeredCount} total={questions.length} />
      </header>

      {/* Question Area */}
      <main className="flex flex-1 items-center justify-center px-4 py-6 sm:py-8">
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
      </main>

      {/* Navigation Footer */}
      <footer className="glass sticky bottom-0 z-40 border-t border-neon-cyan/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4">
          <NeonButton
            variant="ghost"
            size="sm"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0 || submitting}
          >
            <span className="flex items-center gap-1">
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Previous</span>
            </span>
          </NeonButton>

          <span className="font-display text-[10px] tracking-widest text-muted-steel sm:text-xs">
            {currentIndex + 1} / {questions.length}
          </span>

          {isLastQuestion && allAnswered ? (
            <NeonButton
              variant="pink"
              size="md"
              onClick={handleSubmit}
              loading={submitting}
            >
              <span className="flex items-center gap-1">
                <Send size={16} />
                Submit All
              </span>
            </NeonButton>
          ) : (
            <NeonButton
              variant="cyan"
              size="sm"
              onClick={() =>
                setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
              }
              disabled={currentIndex === questions.length - 1 || submitting}
            >
              <span className="flex items-center gap-1">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </span>
            </NeonButton>
          )}
        </div>
      </footer>

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
