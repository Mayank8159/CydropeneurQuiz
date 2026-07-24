import { NextRequest, NextResponse } from "next/server";

const questions: Record<string, unknown> = {};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { qNumber, question, options, correctAnswer } = body;
  const qId = `Q_${qNumber}`;

  questions[qId] = { qId, qNumber, question, options, correctAnswer };

  return NextResponse.json({ success: true, qId });
}
