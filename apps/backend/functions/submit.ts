import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { scanQuestions, putSubmission, scanSubmissions } from "../lib/dynamo";
import { success, badRequest, serverError } from "../lib/responses";

interface SubmitBody {
  playerName: string;
  answers: Record<string, string>;
  timeElapsedMs: number;
}

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    if (!event.body) {
      return badRequest("Request body is required");
    }

    const body: SubmitBody = JSON.parse(event.body);

    if (!body.playerName || !body.answers || body.timeElapsedMs === undefined) {
      return badRequest("playerName, answers, and timeElapsedMs are required");
    }

    const questions = await scanQuestions();
    const questionsByNumber = new Map(
      questions.map((q) => [String(q.qNumber), q])
    );

    let score = 0;
    for (const [qNum, answer] of Object.entries(body.answers)) {
      const question = questionsByNumber.get(qNum);
      if (question && question.correctAnswer === answer) {
        score++;
      }
    }

    const submission = {
      submissionId: uuidv4(),
      playerName: body.playerName,
      score,
      timeElapsedMs: body.timeElapsedMs,
      submittedAt: new Date().toISOString(),
    };

    await putSubmission(submission);

    const allSubmissions = await scanSubmissions();
    const sorted = allSubmissions.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeElapsedMs - b.timeElapsedMs;
    });

    const rank =
      sorted.findIndex((s) => s.submissionId === submission.submissionId) + 1;

    return success({
      score,
      totalQuestions: questions.length,
      timeElapsedMs: body.timeElapsedMs,
      rank,
      totalPlayers: sorted.length,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return serverError("Failed to submit quiz");
  }
}
