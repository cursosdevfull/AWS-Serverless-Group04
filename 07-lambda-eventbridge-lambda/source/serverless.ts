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
  /*  resources: {
    Resources: {
      EventBridgeCurso04: {
        Type: "AWS::Events::EventBus",
        Properties: {
          Name: "EventBusCurso04",
        },
      },
    },
  }, */
};

module.exports = serverlessConfiguration;
