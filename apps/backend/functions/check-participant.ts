import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const PARTICIPANTS_TABLE = process.env.PARTICIPANTS_TABLE!;

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
    const email = event.queryStringParameters?.email?.trim().toLowerCase();

    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Email is required" }),
      };
    }

    const result = await client.send(
      new GetItemCommand({
        TableName: PARTICIPANTS_TABLE,
        Key: {
          email: { S: email },
        },
      })
    );

    const exists = result.Item !== undefined;

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
      body: JSON.stringify({ message: "Failed to check participant email" }),
    };
  }
}
