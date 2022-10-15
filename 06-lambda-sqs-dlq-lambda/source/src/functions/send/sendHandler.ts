import * as AWS from 'aws-sdk';

interface SendMessageSQS {
  MessageBody: string;
  QueueUrl: string;
}

const sqs = new AWS.SQS();

const handler = async (event: any = {}): Promise<any> => {
  //const queueUrl = "https://sqs.us-east-1.amazonaws.com/282865065290/SQSQueue";
  const queueUrl = process.env.SQS_QUEUE_URL;
  const message = {
    user: "shidalgo",
    status: "active",
    date: new Date().getTime(),
  };

  const params: SendMessageSQS = {
    MessageBody: JSON.stringify(message),
    QueueUrl: queueUrl,
  };

  await sqs.sendMessage(params).promise();

  return {
    statusCode: 200,
    body: "Message send",
  };
};

export { handler };
