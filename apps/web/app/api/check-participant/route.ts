import { NextRequest, NextResponse } from "next/server";
import participants from "./participants.json";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawEmail = searchParams.get("email");

  if (!rawEmail) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  const email = rawEmail.trim().toLowerCase();
  const normalizedParticipants = (participants as string[]).map((e) =>
    e.trim().toLowerCase()
  );

  const exists = normalizedParticipants.includes(email);
  return NextResponse.json({ exists });
}
