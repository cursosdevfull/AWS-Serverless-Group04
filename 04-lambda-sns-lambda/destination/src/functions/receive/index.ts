export default {
  handler:
    __dirname.split(process.cwd())[1].substring(1).replace(/\\/g, "/") +
    "/receiveHandler.handler",
  events: [
    {
      sns: {
        arn: "arn:aws:sns:us-east-1:282865065290:SNSTopicAWS04",
        topicName: "SNSTopicAWS04",
      },
    },
  ],
};
