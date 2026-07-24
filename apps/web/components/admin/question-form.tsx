"use client";

import { useState } from "react";
import { NeonInput } from "@/components/ui/neon-input";
import { NeonButton } from "@/components/ui/neon-button";
import { adminCreateQuestion } from "@/lib/api";

interface QuestionFormProps {
  onQuestionCreated?: () => void;
}

export function QuestionForm({ onQuestionCreated }: QuestionFormProps) {
  const [qNumber, setQNumber] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("a");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await adminCreateQuestion({
        qNumber: parseInt(qNumber, 10),
        question,
        options: { a: optionA, b: optionB, c: optionC, d: optionD },
        correctAnswer,
      });
      setSuccess(`Question ${result.qId} saved successfully`);
      setQNumber("");
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("a");
      onQuestionCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NeonInput
          label="Question Number"
          type="number"
          min={1}
          placeholder="1"
          value={qNumber}
          onChange={(e) => setQNumber(e.target.value)}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="font-display text-xs uppercase tracking-widest text-muted-steel">
            Correct Answer
          </label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full rounded-md border border-neon-cyan/20 bg-cyber-surface/50 px-4 py-2.5 text-ice-white font-body outline-none transition-all duration-300 focus:border-neon-cyan/60 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
          >
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
            <option value="d">D</option>
          </select>
        </div>
      </div>

      <NeonInput
        label="Question Text"
        placeholder="Enter the question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NeonInput
          label="Option A"
          placeholder="Option A"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          required
        />
        <NeonInput
          label="Option B"
          placeholder="Option B"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          required
        />
        <NeonInput
          label="Option C"
          placeholder="Option C"
          value={optionC}
          onChange={(e) => setOptionC(e.target.value)}
          required
        />
        <NeonInput
          label="Option D"
          placeholder="Option D"
          value={optionD}
          onChange={(e) => setOptionD(e.target.value)}
          required
        />
      </div>

      {error && (
        <div className="rounded-md border border-neon-pink/30 bg-neon-pink/10 px-4 py-2 font-display text-xs text-neon-pink sm:text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-2 font-display text-xs text-neon-cyan sm:text-sm">
          {success}
        </div>
      )}

      <NeonButton type="submit" loading={loading} variant="cyan">
        Deploy Question
      </NeonButton>
    </form>
  );
}
