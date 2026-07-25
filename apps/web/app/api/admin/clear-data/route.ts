import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    questionsCleared: 0,
    submissionsCleared: 0,
    message: "Local mock: data cleared",
  });
}
