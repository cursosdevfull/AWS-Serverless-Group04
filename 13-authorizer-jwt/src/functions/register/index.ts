import schema from './schema';

export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/registerHandler.handler",
  events: [
    {
      http: {
        method: "post",
        path: "register",
        integration: "lambda",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
