import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "infrastructure",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: {},
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
      SQSPE: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSPE",
        },
      },
      SQSCO: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSCO",
        },
      },
      SQSMX: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSMX",
        },
      },
    },
    Outputs: {
      SQSPEQueueArn: {
        Value: { "Fn::GetAtt": ["SQSPE", "Arn"] },
      },
      SQSPEQueueUrl: {
        Value: { Ref: "SQSPE" },
      },
      SQSCOQueueArn: {
        Value: { "Fn::GetAtt": ["SQSCO", "Arn"] },
      },
      SQSCOQueueUrl: {
        Value: { Ref: "SQSCO" },
      },
      SQSMXQueueArn: {
        Value: { "Fn::GetAtt": ["SQSMX", "Arn"] },
      },
      SQSMXQueueUrl: {
        Value: { Ref: "SQSMX" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
