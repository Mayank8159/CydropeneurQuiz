import { awsDynamodb } from "sst/aws";
import { DynamodbTable } from "sst/aws/dynamodb";

export function createQuizStack() {
  const questionsTable = new DynamodbTable("QuestionsTable", {
    fields: {
      qId: "string",
    },
    primaryIndex: { hashKey: "qId" },
  });

  const submissionsTable = new DynamodbTable("SubmissionsTable", {
    fields: {
      submissionId: "string",
    },
    primaryIndex: { hashKey: "submissionId" },
  });

  return { questionsTable, submissionsTable };
}
