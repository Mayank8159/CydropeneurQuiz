import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const SUBMISSIONS_TABLE = process.env.SUBMISSIONS_TABLE!;

export async function handler(event: any) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  try {
    const name = event.queryStringParameters?.name?.trim().toLowerCase();

    if (!name) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Name is required" }),
      };
    }

    const result = await client.send(
      new ScanCommand({
        TableName: SUBMISSIONS_TABLE,
        FilterExpression: "playerName = :name",
        ExpressionAttributeValues: {
          ":name": { S: name },
        },
      })
    );

    const exists = (result.Items?.length ?? 0) > 0;

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ exists }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Failed to check player name" }),
    };
  }
}
