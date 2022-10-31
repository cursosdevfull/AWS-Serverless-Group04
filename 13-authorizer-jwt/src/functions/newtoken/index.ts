export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/newTokenHandler.handler",
  events: [
    {
      http: {
        method: "post",
        path: "new-token",
      },
    },
  ],
};
