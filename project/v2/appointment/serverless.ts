import create from '@functions/create';

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "appointment",

  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      restApiId: "${ssm:/projectCourse04/${self:provider.stage}/restApiId}",
      restApiRootResourceId:
        "${ssm:/projectCourse04/${self:provider.stage}/restApiRootResourceId}",
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      SQSPE_QUEUE_URL:
        "${cf:infrastructure-${self:provider.stage}.SQSPEQueueUrl}",
      SQSCO_QUEUE_URL:
        "${cf:infrastructure-${self:provider.stage}.SQSCOQueueUrl}",
      SQSMX_QUEUE_URL:
        "${cf:infrastructure-${self:provider.stage}.SQSMXQueueUrl}",
    },
    iam: {
      role: "${ssm:/projectCourse04/${self:provider.stage}/roleLambda}",
    },
  },
  // import the function via paths
  functions: { create },
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
};

module.exports = serverlessConfiguration;
