import * as AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export class UserService {
  public static async register(
    name: string,
    email: string,
    password: string
  ): Promise<any> {
    const record = {
      email,
      name,
      password,
      timestamp: new Date(),
    };

    const paramsDynamoDB = {
      TableName: "user-dev",
      Item: record,
    };

    await dynamodb.put(paramsDynamoDB).promise();
  }

  static async getUser(email: string): Promise<any> {
    const paramsDynamoDB = {
      TableName: "user-dev",
      Key: { email },
    };

    const result = await dynamodb.get(paramsDynamoDB).promise();

    return result.Item;
  }
}
