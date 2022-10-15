import send from '@functions/send';

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "lambda-evtbridge-sqs",
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
            Action: ["events:PutEvents"],
            Resource: "*",
          },
          /* {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: "arn:aws:sns:us-east-1:282865065290:SNSTopicAWS04",
          }, */
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
      SQSQueueEvtB: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSQueueEvtB",
        },
      },
      EventBusSQS: {
        Type: "AWS::Events::EventBus",
        Properties: {
          Name: "EventBusSQS",
        },
      },
      EventRule: {
        Type: "AWS::Events::Rule",
        Properties: {
          EventBusName: { "Fn::GetAtt": ["EventBusSQS", "Name"] },
          EventPattern: {
            source: ["appointment"],
            "detail-type": ["appointment.cancel"],
          },
          Targets: [
            {
              Arn: { "Fn::GetAtt": ["SQSQueueEvtB", "Arn"] },
              Id: "SQSQueueEvtB",
            },
          ],
        },
      },
      EventBridgeSQSPermission: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "events.amazonaws.com" },
                Action: "sqs:*",
                Resource: { "Fn::GetAtt": ["SQSQueueEvtB", "Arn"] },
              },
            ],
          },
          Queues: [{ Ref: "SQSQueueEvtB" }],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
