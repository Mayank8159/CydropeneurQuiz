import { NextResponse } from "next/server";
import { getAllQuestions } from "../store";

export async function GET() {
  const questions = getAllQuestions().map(({ correctAnswer, ...rest }) => rest);
  return NextResponse.json(questions);
}
