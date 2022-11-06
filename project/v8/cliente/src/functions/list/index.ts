export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/listHandler.handler",
  events: [
    {
      http: {
        method: "post",
        path: "clients",
        private: true,
      },
    },
  ],
};
