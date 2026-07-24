import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshal, unmarshal } from "./dynamo-marshal";

const client = new DynamoDBClient({});

const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE!;
const SUBMISSIONS_TABLE = process.env.SUBMISSIONS_TABLE!;

export async function putQuestion(question: {
  qId: string;
  qNumber: number;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: string;
}) {
  await client.send(
    new PutItemCommand({
      TableName: QUESTIONS_TABLE,
      Item: marshal({
        qId: question.qId,
        qNumber: question.qNumber,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
      }),
    })
  );
}

export async function getQuestion(qId: string) {
  const result = await client.send(
    new GetItemCommand({
      TableName: QUESTIONS_TABLE,
      Key: marshal({ qId }),
    })
  );
  if (!result.Item) return null;
  return unmarshal(result.Item) as {
    qId: string;
    qNumber: number;
    question: string;
    options: { a: string; b: string; c: string; d: string };
    correctAnswer: string;
  };
}

export async function scanQuestions() {
  const result = await client.send(
    new ScanCommand({ TableName: QUESTIONS_TABLE })
  );
  if (!result.Items) return [];
  return result.Items.map((item) => unmarshal(item) as {
    qId: string;
    qNumber: number;
    question: string;
    options: { a: string; b: string; c: string; d: string };
    correctAnswer: string;
  });
}

export async function putSubmission(submission: {
  submissionId: string;
  playerName: string;
  score: number;
  timeElapsedMs: number;
  submittedAt: string;
}) {
  await client.send(
    new PutItemCommand({
      TableName: SUBMISSIONS_TABLE,
      Item: marshal({
        submissionId: submission.submissionId,
        playerName: submission.playerName,
        score: submission.score,
        timeElapsedMs: submission.timeElapsedMs,
        submittedAt: submission.submittedAt,
      }),
    })
  );
}

export async function scanSubmissions() {
  const result = await client.send(
    new ScanCommand({ TableName: SUBMISSIONS_TABLE })
  );
  if (!result.Items) return [];
  return result.Items.map((item) => unmarshal(item) as {
    submissionId: string;
    playerName: string;
    score: number;
    timeElapsedMs: number;
    submittedAt: string;
  });
}
