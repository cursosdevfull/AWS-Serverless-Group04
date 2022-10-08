import * as AWS from 'aws-sdk';

interface SendMessageSNS {
  Message: string;
  TopicArn: string;
}

const sns = new AWS.SNS();

const handler = async (event: any = {}): Promise<any> => {
  const topicArn = process.env.SNS_TOPIC_ARN;
  const message = {
    user: "shidalgo",
    status: "active",
    date: new Date().getTime(),
  };

  const params: SendMessageSNS = {
    Message: JSON.stringify(message),
    TopicArn: topicArn,
  };

  await sns.publish(params).promise();

  console.log("Parameters: ", params);

  return {
    statusCode: 200,
    body: "Message send",
  };
};

export { handler };
