import { NextResponse } from "next/server";

const leaderboard: Array<{
  rank: number;
  playerName: string;
  score: number;
  timeElapsedMs: number;
  submittedAt: string;
}> = [];

export async function GET() {
  return NextResponse.json(leaderboard);
}
