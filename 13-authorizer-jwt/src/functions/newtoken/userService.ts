import * as AWS from 'aws-sdk';

import { TokenService } from './tokenService';

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
      refreshToken: TokenService.createRefreshToken(),
      timestamp: new Date().toISOString(),
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

  static async getUserByRefreshToken(refreshToken: string): Promise<any> {
    const paramsDynamoDB = {
      ExpressionAttributeValues: {
        ":refreshToken": refreshToken,
      },
      FilterExpression: "refreshToken = :refreshToken",
      TableName: "user-dev",
    };

    console.log("paramsDynamoDB", paramsDynamoDB);

    const result = await dynamodb.scan(paramsDynamoDB).promise();

    return result.Items;
  }

  static async update(email: string, refreshToken: string) {
    const paramsDynamoDB = {
      TableName: "user-dev",
      Key: { email },
      UpdateExpression: "set refreshToken = :refreshToken",
      ExpressionAttributeValues: {
        ":refreshToken": refreshToken,
      },
    };

    await dynamodb.update(paramsDynamoDB).promise();
  }
}
