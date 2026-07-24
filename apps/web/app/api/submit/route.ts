import { NextRequest, NextResponse } from "next/server";

const correctAnswers: Record<string, string> = {
  "1": "a",
  "2": "c",
  "3": "b",
  "4": "d",
  "5": "b",
};

const submissions: Array<{
  playerName: string;
  score: number;
  timeElapsedMs: number;
  submittedAt: string;
}> = [];

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { playerName, answers, timeElapsedMs } = body;

  let score = 0;
  for (const [qNum, answer] of Object.entries(answers as Record<string, string>)) {
    if (correctAnswers[qNum] === answer) {
      score++;
    }
  }

  const submission = {
    playerName,
    score,
    timeElapsedMs,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(submission);

  const sorted = submissions
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeElapsedMs - b.timeElapsedMs;
    });

  const rank = sorted.findIndex((s) => s === submission) + 1;

  return NextResponse.json({
    score,
    totalQuestions: Object.keys(correctAnswers).length,
    timeElapsedMs,
    rank,
    totalPlayers: sorted.length,
  });
}
