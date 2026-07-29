import { NextRequest, NextResponse } from "next/server";

/**
 * Fallback route for GET /api/check-player
 *
 * When NEXT_PUBLIC_API_URL is set (production/staging), this route is never
 * reached — all calls are routed to AWS Lambda + DynamoDB instead.
 *
 * This route handles the case when NEXT_PUBLIC_API_URL is blank (local dev),
 * returning exists=false since there is no local DynamoDB instance.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim().toLowerCase();

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  return NextResponse.json({ exists: false });
}
