declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
  interface Process {
    env: ProcessEnv;
  }
}
declare var process: NodeJS.Process;

declare const $config: (config: any) => any;
declare namespace sst {
  namespace aws {
    class Dynamo {
      constructor(name: string, args: any);
      name: string;
    }
    class ApiGatewayV2 {
      constructor(name: string, args: any);
      url: string;
      route(path: string, args: any): void;
    }
  }
}