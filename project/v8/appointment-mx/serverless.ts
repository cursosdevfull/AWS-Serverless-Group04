import create from '@functions/create';

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "appointment-mx",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      DATABASE_NAME:
        "${cf:infrastructure-${self:provider.stage}.NotificationTableMX}",
    },
    iam: {
      role: "arn:aws:iam::282865065290:role/role-dynamodb",
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
