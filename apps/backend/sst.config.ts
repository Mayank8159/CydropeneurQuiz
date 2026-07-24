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

    api.route("GET /questions", {
      handler: "functions/questions.handler",
      bind: [questionsTable],
    });

    api.route("POST /submit", {
      handler: "functions/submit.handler",
      bind: [questionsTable, submissionsTable],
    });

    api.route("ANY /admin/questions", {
      handler: "functions/admin-questions.handler",
      bind: [questionsTable],
      environment: {
        ADMIN_PASSKEY: process.env.ADMIN_PASSKEY || "",
      },
    });

    api.route("GET /admin/leaderboard", {
      handler: "functions/admin-leaderboard.handler",
      bind: [submissionsTable],
    });

    return {
      ApiEndpoint: api.url,
    };
  },
});
