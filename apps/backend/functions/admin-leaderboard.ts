import {
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const TABLE = process.env.SUBMISSIONS_TABLE!;

export async function handler() {
  try {
    const result = await client.send(new ScanCommand({ TableName: TABLE }));
    const items = (result.Items || []).map((i) => unmarshall(i));

    items.sort((a, b) => {
      if ((b.score as number) !== (a.score as number)) return (b.score as number) - (a.score as number);
      return (a.timeElapsedMs as number) - (b.timeElapsedMs as number);
    });

    const leaderboard = items.map((entry, index) => ({
      rank: index + 1,
      playerName: entry.playerName,
      playerEmail: entry.playerEmail || "",
      score: entry.score,
      timeElapsedMs: entry.timeElapsedMs,
      submittedAt: entry.submittedAt,
    }));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify(leaderboard),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Failed to fetch leaderboard" }),
    };
  }
}
