export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/sendHandler.handler",
  events: [
    {
      http: {
        method: "post",
        path: "send",
      },
    },
  ],
};
