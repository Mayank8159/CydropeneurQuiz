import { NextRequest, NextResponse } from "next/server";
import { getAllQuestions } from "../store";

const submissions: Array<{
  submissionId: string;
  playerName: string;
  score: number;
  timeElapsedMs: number;
  submittedAt: string;
}> = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerName, answers, timeElapsedMs } = body;

  const questions = getAllQuestions();
  let score = 0;
  for (const [qNum, answer] of Object.entries(answers as Record<string, string>)) {
    const q = questions.find((question) => String(question.qNumber) === qNum);
    if (q && q.correctAnswer === answer) {
      score++;
    }
  }

  const submission = {
    submissionId: crypto.randomUUID(),
    playerName,
    score,
    timeElapsedMs,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(submission);

  const sorted = submissions.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeElapsedMs - b.timeElapsedMs;
  });

  const rank = sorted.findIndex((s) => s === submission) + 1;

  return NextResponse.json({
    score,
    totalQuestions: questions.length,
    timeElapsedMs,
    rank,
    totalPlayers: sorted.length,
  });
}
