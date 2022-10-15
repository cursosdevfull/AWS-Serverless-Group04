import send from '@functions/send';

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "lambda-source",
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
      SQS_QUEUE_URL:
        "https://sqs.us-east-1.amazonaws.com/282865065290/SQSQueue",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "arn:aws:sqs:us-east-1:282865065290:SQSQueue",
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
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSQueue",
          RedrivePolicy: {
            deadLetterTargetArn: { "Fn::GetAtt": ["SQSQueueDLQ", "Arn"] },
            maxReceiveCount: 1,
          },
        },
      },
      SQSQueueDLQ: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSQueueDLQ",
          MessageRetentionPeriod: 86400,
          VisibilityTimeout: 20,
        },
      },
    },
    Outputs: {
      SQSQueueArn: {
        Value: { "Fn::GetAtt": ["SQSQueue", "Arn"] },
      },
      SQSQueueUrl: {
        Value: { Ref: "SQSQueue" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
