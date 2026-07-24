import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { scanSubmissions } from "../lib/dynamo";
import { success, serverError } from "../lib/responses";

export async function handler(
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const submissions = await scanSubmissions();

    const sorted = submissions
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.timeElapsedMs - b.timeElapsedMs;
      })
      .map((entry, index) => ({
        rank: index + 1,
        playerName: entry.playerName,
        score: entry.score,
        timeElapsedMs: entry.timeElapsedMs,
        submittedAt: entry.submittedAt,
      }));

    return success(sorted);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return serverError("Failed to fetch leaderboard");
  }
}
