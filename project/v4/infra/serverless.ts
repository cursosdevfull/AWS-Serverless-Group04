import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "infrastructure",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'dev'}",
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
          QueueName: "SQSPE-${self:provider.stage}",
        },
      },
      SQSCO: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSCO-${self:provider.stage}",
        },
      },
      SQSMX: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSMX-${self:provider.stage}",
        },
      },
      SNSTopicPE: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTopicPE-${self:provider.stage}",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: { "Fn::GetAtt": ["SQSPE", "Arn"] },
            },
          ],
        },
      },
      SNSTopicCO: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTopicCO-${self:provider.stage}",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: { "Fn::GetAtt": ["SQSCO", "Arn"] },
            },
          ],
        },
      },
      SNSTopicMX: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTopicMX-${self:provider.stage}",
          Subscription: [
            {
              Protocol: "sqs",
              Endpoint: { "Fn::GetAtt": ["SQSMX", "Arn"] },
            },
          ],
        },
      },
      SQSQueuePolicyPE: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSPE" }],
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
                    "aws:SourceArn": { Ref: "SNSTopicPE" },
                  },
                },
              },
            ],
          },
        },
      },
      SQSQueuePolicyCO: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSCO" }],
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
                    "aws:SourceArn": { Ref: "SNSTopicCO" },
                  },
                },
              },
            ],
          },
        },
      },
      SQSQueuePolicyMX: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{ Ref: "SQSMX" }],
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
                    "aws:SourceArn": { Ref: "SNSTopicMX" },
                  },
                },
              },
            ],
          },
        },
      },
      SSMTopicPE: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/topic/${self:provider.stage}/SNSTopicPE",
          Type: "String",
          Value: { "Fn::GetAtt": ["SNSTopicPE", "TopicArn"] },
        },
      },
      SSMTopicCO: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/topic/${self:provider.stage}/SNSTopicCO",
          Type: "String",
          Value: { "Fn::GetAtt": ["SNSTopicCO", "TopicArn"] },
        },
      },
      SSMTopicMX: {
        Type: "AWS::SSM::Parameter",
        Properties: {
          Name: "/topic/${self:provider.stage}/SNSTopicMX",
          Type: "String",
          Value: { "Fn::GetAtt": ["SNSTopicMX", "TopicArn"] },
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
