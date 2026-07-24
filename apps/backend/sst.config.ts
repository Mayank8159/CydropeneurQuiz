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
});
