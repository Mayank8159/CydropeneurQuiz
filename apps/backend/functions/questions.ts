import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { scanQuestions } from "../lib/dynamo";
import { success, serverError } from "../lib/responses";

export async function handler(
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const questions = await scanQuestions();

    const sanitized = questions
      .sort((a, b) => a.qNumber - b.qNumber)
      .map(({ correctAnswer, ...rest }) => rest);

    return success(sanitized);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return serverError("Failed to fetch questions");
  }
}
