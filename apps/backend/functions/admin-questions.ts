import {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  DeleteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const TABLE = process.env.QUESTIONS_TABLE!;
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "";

export async function handler(event: any) {
  try {
    const method = event.requestContext?.http?.method;

    if (method === "OPTIONS") {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,x-admin-passkey",
        },
        body: "",
      };
    }

    // --- GET: list all questions ---
    if (method === "GET") {
      const result = await client.send(new ScanCommand({ TableName: TABLE }));
      const items = (result.Items || []).map((i) => unmarshall(i));
      items.sort((a, b) => (a.qNumber as number) - (b.qNumber as number));
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify(items),
      };
    }

    // --- POST: create/update question ---
    if (method === "POST") {
      const authHeader = event.headers?.["x-admin-passkey"] || event.headers?.["X-Admin-Passkey"];
      if (authHeader !== ADMIN_PASSKEY) {
        return {
          statusCode: 401,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ message: "Admin clearance required" }),
        };
      }

      const body = JSON.parse(event.body || "{}");
      const { qNumber, question, options, correctAnswer } = body;

      if (!qNumber || !question || !options || !correctAnswer) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ message: "All fields are required" }),
        };
      }

      if (!["a", "b", "c", "d"].includes(correctAnswer)) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ message: "correctAnswer must be a, b, c, or d" }),
        };
      }

      const qId = `Q_${qNumber}`;

      await client.send(
        new PutItemCommand({
          TableName: TABLE,
          Item: marshall({ qId, qNumber, question, options, correctAnswer }),
        })
      );

      return {
        statusCode: 201,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: true, qId }),
      };
    }

    // --- DELETE: remove a question ---
    if (method === "DELETE") {
      const authHeader = event.headers?.["x-admin-passkey"] || event.headers?.["X-Admin-Passkey"];
      if (authHeader !== ADMIN_PASSKEY) {
        return {
          statusCode: 401,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ message: "Admin clearance required" }),
        };
      }

      const qId = event.queryStringParameters?.qId;
      if (!qId) {
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ message: "qId query parameter is required" }),
        };
      }

      await client.send(
        new DeleteItemCommand({
          TableName: TABLE,
          Key: marshall({ qId }),
        })
      );

      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
}
