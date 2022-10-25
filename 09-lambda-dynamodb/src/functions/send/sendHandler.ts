import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamodb = new AWS.DynamoDB.DocumentClient();

const handler = async (event: any = {}): Promise<any> => {
  const record = {
    id: uuidv4(),
    name: "sergio.hidalgo",
    date: "2022-10-22 09:20:00",
    countryISO: "PE",
    timestamp: new Date().getTime(),
  };

  const paramsDynamoDB = {
    TableName: "notification-dev",
    Item: record,
  };

  console.log(paramsDynamoDB);

  await dynamodb.put(paramsDynamoDB).promise();

  return {
    statusCode: 200,
    body: "Message send",
  };
};

export { handler };
