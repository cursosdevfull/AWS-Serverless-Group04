import schema from './schema';

export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/loginHandler.handler",
  events: [
    {
      http: {
        method: "post",
        path: "login",
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
