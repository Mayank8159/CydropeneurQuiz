import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { putQuestion } from "../lib/dynamo";
import { success, created, badRequest, unauthorized, serverError } from "../lib/responses";

const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "";

interface AdminQuestionBody {
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
}

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const authHeader =
      event.headers?.["x-admin-passkey"] ||
      event.headers?.["X-Admin-Passkey"];

    if (authHeader !== ADMIN_PASSKEY) {
      return unauthorized("Admin clearance required");
    }

    if (!event.body) {
      return badRequest("Request body is required");
    }

    const body: AdminQuestionBody = JSON.parse(event.body);

    if (
      !body.qNumber ||
      !body.question ||
      !body.options ||
      !body.correctAnswer
    ) {
      return badRequest("All fields are required");
    }

    if (!["a", "b", "c", "d"].includes(body.correctAnswer)) {
      return badRequest("correctAnswer must be a, b, c, or d");
    }

    const qId = `Q_${body.qNumber}`;

    await putQuestion({
      qId,
      qNumber: body.qNumber,
      question: body.question,
      options: body.options,
      correctAnswer: body.correctAnswer,
    });

    return created({ success: true, qId });
  } catch (error) {
    console.error("Error creating question:", error);
    return serverError("Failed to create question");
  }
}
