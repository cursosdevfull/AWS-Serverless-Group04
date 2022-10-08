import send from '@functions/send';

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "lambda-sns",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:282865065290:SNSTopicAWS04",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: "arn:aws:sns:us-east-1:282865065290:SNSTopicAWS04",
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { send },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      SNSTopicAWS04: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTopicAWS04",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: { "Fn::GetAtt": ["SQSLambda", "Arn"] },
            },
          ],
        },
      },
      SQSLambda: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSLambda",
        },
      },
      SQSQueuePolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSLambda" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "sqs:SendMessage",
                Resource: "*",
                Principal: "*",
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "SNSTopicAWS04" },
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
