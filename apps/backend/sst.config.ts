/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cydropeneur-quiz",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  aws: {
    region: "ap-south-1",
  },
  async run() {
    const questionsTable = new sst.aws.Dynamo("QuestionsTable", {
      fields: {
        qId: "string",
      },
      primaryIndex: { hashKey: "qId" },
    });

    const submissionsTable = new sst.aws.Dynamo("SubmissionsTable", {
      fields: {
        submissionId: "string",
      },
      primaryIndex: { hashKey: "submissionId" },
    });

    const api = new sst.aws.ApiGatewayV2("QuizApi");

    api.route("GET /api/questions", {
      handler: "functions/questions.handler",
      bind: [questionsTable],
      environment: {
        QUESTIONS_TABLE: questionsTable.name,
      },
    });

    api.route("POST /api/submit", {
      handler: "functions/submit.handler",
      bind: [questionsTable, submissionsTable],
      environment: {
        QUESTIONS_TABLE: questionsTable.name,
        SUBMISSIONS_TABLE: submissionsTable.name,
      },
    });

    api.route("ANY /api/admin/questions", {
      handler: "functions/admin-questions.handler",
      bind: [questionsTable],
      environment: {
        QUESTIONS_TABLE: questionsTable.name,
        ADMIN_PASSKEY: process.env.ADMIN_PASSKEY || "",
      },
    });

    api.route("GET /api/admin/leaderboard", {
      handler: "functions/admin-leaderboard.handler",
      bind: [submissionsTable],
      environment: {
        SUBMISSIONS_TABLE: submissionsTable.name,
      },
    });

    return {
      ApiEndpoint: api.url,
    };
  },
});
