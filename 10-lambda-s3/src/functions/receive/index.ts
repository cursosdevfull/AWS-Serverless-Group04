export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/receiveHandler.handler",
  events: [
    {
      s3: {
        bucket: "bucket-legacy",
        event: "s3:ObjectCreated:*",
        existing: true,
        rules: [
          {
            suffix: ".csv",
          },
          {
            prefix: "medics/",
          },
        ],
      },
    },
  ],
};
