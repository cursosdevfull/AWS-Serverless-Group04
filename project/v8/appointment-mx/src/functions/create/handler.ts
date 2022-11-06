import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const create = async (event) => {
  console.log(event);
  const messages = [];

  const listPromises = [];

  for (const record of event.Records) {
    messages.push(record.body);

    const message = JSON.parse(record.body);

    const appointment = {
      ...message.detail,
      id: uuidv4(),
      timestamp: new Date().getTime(),
    };

    listPromises.push(
      dynamodb.put({
        TableName: process.env.DATABASE_NAME,
        Item: appointment,
      })
    );
  }

  await Promise.all(listPromises);

  console.log("Received messages: ", messages);

  return {
    statusCode: 200,
    body: JSON.stringify(messages),
  };
};

export const main = create;
