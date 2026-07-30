/// <reference path="./sst-env.d.ts" />

export default $config({
  app(input: any) {
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

    const participantsTable = new sst.aws.Dynamo("ParticipantsTable", {
      fields: {
        email: "string",
      },
      primaryIndex: { hashKey: "email" },
    });

    const api = new sst.aws.ApiGatewayV2("QuizApi", {
      cors: {
        allowOrigins: ["*"],
        allowHeaders: ["Content-Type", "x-admin-passkey"],
        allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
      },
    });

    api.route("GET /api/questions", {
      handler: "functions/questions.handler",
      link: [questionsTable],
      environment: {
        QUESTIONS_TABLE: questionsTable.name,
      },
    });

    api.route("POST /api/submit", {
      handler: "functions/submit.handler",
      link: [questionsTable, submissionsTable],
      environment: {
        QUESTIONS_TABLE: questionsTable.name,
        SUBMISSIONS_TABLE: submissionsTable.name,
      },
    });

    api.route("ANY /api/admin/questions", {
      handler: "functions/admin-questions.handler",
      link: [questionsTable],
      environment: {
        QUESTIONS_TABLE: questionsTable.name,
        ADMIN_PASSKEY: process.env.ADMIN_PASSKEY || "",
      },
    });

    api.route("GET /api/admin/leaderboard", {
      handler: "functions/admin-leaderboard.handler",
      link: [submissionsTable],
      environment: {
        SUBMISSIONS_TABLE: submissionsTable.name,
      },
    });

    api.route("GET /api/check-player", {
      handler: "functions/check-player.handler",
      link: [submissionsTable],
      environment: {
        SUBMISSIONS_TABLE: submissionsTable.name,
      },
    });

    api.route("GET /api/check-participant", {
      handler: "functions/check-participant.handler",
      link: [participantsTable],
      environment: {
        PARTICIPANTS_TABLE: participantsTable.name,
      },
    });

    api.route("POST /api/admin/clear-data", {
      handler: "functions/admin-clear-data.handler",
      link: [questionsTable, submissionsTable],
      environment: {
        QUESTIONS_TABLE: questionsTable.name,
        SUBMISSIONS_TABLE: submissionsTable.name,
        ADMIN_PASSKEY: process.env.ADMIN_PASSKEY || "",
      },
    });

    api.route("POST /api/admin/login", {
      handler: "functions/admin-login.handler",
      environment: {
        ADMIN_EMAIL: process.env.ADMIN_EMAIL || "",
        ADMIN_PASSKEY: process.env.ADMIN_PASSKEY || "",
      },
    });

    return {
      ApiEndpoint: api.url,
    };
  },
});
