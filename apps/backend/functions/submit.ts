import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { randomUUID } from "crypto";

const client = new DynamoDBClient({});
const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE!;
const SUBMISSIONS_TABLE = process.env.SUBMISSIONS_TABLE!;

export async function handler(event: any) {
  try {
    if (event.requestContext?.http?.method === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: "",
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { playerName: rawName, answers, timeElapsedMs } = body;
    const playerName = rawName?.trim().toLowerCase();

    if (!playerName || !answers || timeElapsedMs === undefined) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "playerName, answers, and timeElapsedMs are required" }),
      };
    }

    const qResult = await client.send(new ScanCommand({ TableName: QUESTIONS_TABLE }));
    const questions = (qResult.Items || []).map((i) => unmarshall(i));

    let score = 0;
    for (const [qNum, answer] of Object.entries(answers as Record<string, string>)) {
      const q = questions.find((question) => String(question.qNumber) === qNum);
      if (q && q.correctAnswer === answer) {
        score++;
      }
    }

    const submission = {
      submissionId: randomUUID(),
      playerName,
      score,
      timeElapsedMs,
      submittedAt: new Date().toISOString(),
    };

    await client.send(
      new PutItemCommand({
        TableName: SUBMISSIONS_TABLE,
        Item: marshall(submission),
      })
    );

    const sResult = await client.send(new ScanCommand({ TableName: SUBMISSIONS_TABLE }));
    const allSubs = (sResult.Items || []).map((i) => unmarshall(i));
    allSubs.sort((a, b) => {
      if (b.score !== a.score) return (b.score as number) - (a.score as number);
      return (a.timeElapsedMs as number) - (b.timeElapsedMs as number);
    });

    const rank = allSubs.findIndex((s) => s.submissionId === submission.submissionId) + 1;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({
        score,
        totalQuestions: questions.length,
        timeElapsedMs,
        rank,
        totalPlayers: allSubs.length,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Failed to submit quiz" }),
    };
  }
}
