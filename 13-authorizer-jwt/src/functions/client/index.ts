export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/clientHandler.handler",
  events: [
    {
      http: {
        method: "get",
        path: "client",
        integration: "lambda",
        authorizer: "authorizer",
      },
    },
  ],
};
