import {
  DynamoDBClient,
  ScanCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE!;
const SUBMISSIONS_TABLE = process.env.SUBMISSIONS_TABLE!;
const ADMIN_PASSKEY = process.env.ADMIN_PASSKEY || "";

async function clearTable(tableName: string): Promise<number> {
  let deleted = 0;
  let lastKey: Record<string, any> | undefined;

  do {
    const scanResult = await client.send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastKey,
        ProjectionExpression: "qId, submissionId",
      })
    );

    const items = scanResult.Items || [];
    if (items.length === 0) break;

    const keys = items.map((item) => {
      const key = Object.keys(item).reduce(
        (acc, k) => ({ ...acc, [k]: item[k] }),
        {} as Record<string, any>
      );
      return { DeleteRequest: { Key: key } };
    });

    for (let i = 0; i < keys.length; i += 25) {
      const batch = keys.slice(i, i + 25);
      await client.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [tableName]: batch,
          },
        })
      );
      deleted += batch.length;
    }

    lastKey = scanResult.LastEvaluatedKey;
  } while (lastKey);

  return deleted;
}

export async function handler(event: any) {
  try {
    if (event.requestContext?.http?.method !== "POST") {
      return {
        statusCode: 405,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Method not allowed" }),
      };
    }

    const authHeader =
      event.headers?.["x-admin-passkey"] || event.headers?.["X-Admin-Passkey"];
    if (authHeader !== ADMIN_PASSKEY) {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Admin clearance required" }),
      };
    }

    const [questionsCleared, submissionsCleared] = await Promise.all([
      clearTable(QUESTIONS_TABLE),
      clearTable(SUBMISSIONS_TABLE),
    ]);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        questionsCleared,
        submissionsCleared,
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Failed to clear data" }),
    };
  }
}
