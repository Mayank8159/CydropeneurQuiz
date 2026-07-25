import {
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({});
const TABLE = JSON.parse(process.env.SST_RESOURCE_QuestionsTable || "{}").name;

export async function handler() {
  try {
    const result = await client.send(new ScanCommand({ TableName: TABLE }));
    const items = (result.Items || []).map((i) => unmarshall(i));
    items.sort((a, b) => (a.qNumber as number) - (b.qNumber as number));

    const sanitized = items.map(({ correctAnswer, ...rest }) => rest);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitized),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Failed to fetch questions" }),
    };
  }
}
