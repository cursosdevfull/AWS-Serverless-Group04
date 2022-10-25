export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/receiveHandler.handler",
  events: [
    {
      sqs: {
        arn: "arn:aws:sqs:us-east-1:282865065290:SQSEmails",
      },
    },
  ],
};
