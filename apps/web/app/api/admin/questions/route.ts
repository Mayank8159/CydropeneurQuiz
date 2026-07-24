import { NextRequest, NextResponse } from "next/server";
import { getAllQuestions, setQuestion } from "../../store";

export async function GET() {
  const questions = getAllQuestions();
  return NextResponse.json(questions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { qNumber, question, options, correctAnswer } = body;
  const qId = `Q_${qNumber}`;

  setQuestion({ qId, qNumber, question, options, correctAnswer });

  return NextResponse.json({ success: true, qId });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qId = searchParams.get("qId");

  if (!qId) {
    return NextResponse.json({ message: "qId query parameter is required" }, { status: 400 });
  }

  const { deleteQuestion } = await import("../../store");
  const deleted = deleteQuestion(qId);

  if (!deleted) {
    return NextResponse.json({ message: "Question not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
