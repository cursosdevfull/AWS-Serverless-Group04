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
      S3Bucket: {
        Type: "AWS::S3::Bucket",
        DeletionPolicy: "Delete",
        Properties: {
          BucketName: "bucket-curso04-${self:provider.stage}",
        },
      },
      SQSPE: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSPE-${self:provider.stage}",
          RedrivePolicy: {
            deadLetterTargetArn: { "Fn::GetAtt": ["SQSDLQ", "Arn"] },
            maxReceiveCount: 1,
          },
        },
      },
      SQSCO: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSCO-${self:provider.stage}",
          RedrivePolicy: {
            deadLetterTargetArn: { "Fn::GetAtt": ["SQSDLQ", "Arn"] },
            maxReceiveCount: 1,
          },
        },
      },
      SQSMX: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSMX-${self:provider.stage}",
          RedrivePolicy: {
            deadLetterTargetArn: { "Fn::GetAtt": ["SQSDLQ", "Arn"] },
            maxReceiveCount: 1,
          },
        },
      },
      SQSDLQ: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "SQSDLQ-Project-${self:provider.stage}",
          VisibilityTimeout: 20,
          MessageRetentionPeriod: 86400,
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
      EventBusProject: {
        Type: "AWS::Events::EventBus",
        Properties: {
          Name: "EventBusProject-${self:provider.stage}",
        },
      },
      EventRulePE: {
        Type: "AWS::Events::Rule",
        Properties: {
          EventBusName: { "Fn::GetAtt": ["EventBusProject", "Name"] },
          EventPattern: {
            source: ["appointment"],
            "detail-type": ["appointment.cancel.pe"],
          },
          Targets: [
            {
              Arn: { "Fn::GetAtt": ["SQSPE", "Arn"] },
              Id: "SQSPE",
            },
          ],
        },
      },
      EventRuleCO: {
        Type: "AWS::Events::Rule",
        Properties: {
          EventBusName: { "Fn::GetAtt": ["EventBusProject", "Name"] },
          EventPattern: {
            source: ["appointment"],
            "detail-type": ["appointment.cancel.co"],
          },
          Targets: [
            {
              Arn: { "Fn::GetAtt": ["SQSCO", "Arn"] },
              Id: "SQSCO",
            },
          ],
        },
      },
      EventRuleMX: {
        Type: "AWS::Events::Rule",
        Properties: {
          EventBusName: { "Fn::GetAtt": ["EventBusProject", "Name"] },
          EventPattern: {
            source: ["appointment"],
            "detail-type": ["appointment.cancel.mx"],
          },
          Targets: [
            {
              Arn: { "Fn::GetAtt": ["SQSMX", "Arn"] },
              Id: "SQSMX",
            },
          ],
        },
      },
      EventBridgeSQSPermissionPE: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "events.amazonaws.com" },
                Action: "sqs:*",
                Resource: { "Fn::GetAtt": ["SQSPE", "Arn"] },
              },
            ],
          },
          Queues: [{ Ref: "SQSPE" }],
        },
      },
      EventBridgeSQSPermissionCO: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "events.amazonaws.com" },
                Action: "sqs:*",
                Resource: { "Fn::GetAtt": ["SQSCO", "Arn"] },
              },
            ],
          },
          Queues: [{ Ref: "SQSCO" }],
        },
      },
      EventBridgeSQSPermissionMX: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Effect: "Allow",
                Principal: { Service: "events.amazonaws.com" },
                Action: "sqs:*",
                Resource: { "Fn::GetAtt": ["SQSMX", "Arn"] },
              },
            ],
          },
          Queues: [{ Ref: "SQSMX" }],
        },
      },
      NotificationTablePE: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "notification-pe-${self:provider.stage}",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
        },
      },
      NotificationTableCO: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "notification-co-${self:provider.stage}",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
        },
      },
      NotificationTableMX: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "notification-mx-${self:provider.stage}",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
        },
      },
      NotificationTableCS: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "notification-cs-${self:provider.stage}",
          BillingMode: "PAY_PER_REQUEST",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
        },
      },
      CognitoUserPool: {
        Type: "AWS::Cognito::UserPool",
        Properties: {
          UserPoolName: "user-pool-appointment",
          AutoVerifiedAttributes: ["email"],
          EmailVerificationSubject: "Verificación necesaria",
          EmailVerificationMessage:
            "Use el siguiente código para verificar su cuenta {####}",
        },
      },
      CognitoUserPoolClient: {
        Type: "AWS::Cognito::UserPoolClient",
        Properties: {
          ClientName: "user-pool-client-appointment",
          GenerateSecret: false,
          UserPoolId: { Ref: "CognitoUserPool" },
          ExplicitAuthFlows: [
            "ALLOW_USER_PASSWORD_AUTH",
            "ALLOW_REFRESH_TOKEN_AUTH",
          ],
        },
      },
      CognitoIdentityPool: {
        Type: "AWS::Cognito::IdentityPool",
        Properties: {
          IdentityPoolName: "identity-pool-appointment",
          AllowUnauthenticatedIdentities: false,
          CognitoIdentityProviders: [
            {
              ProviderName: {
                "Fn::GetAtt": ["CognitoUserPool", "ProviderName"],
              },
              ClientId: { Ref: "CognitoUserPoolClient" },
            },
          ],
        },
      },
      CognitoAuthRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "cognito-auth-role-appointment",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Federated: "cognito-identity.amazonaws.com",
                },
                Action: ["sts:AssumeRoleWithWebIdentity"],
                Condition: {
                  StringEquals: {
                    "cognito-identity.amazonaws.com:aud": {
                      Ref: "CognitoIdentityPool",
                    },
                  },
                  "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "authenticated",
                  },
                },
              },
            ],
          },
          Policies: [
            {
              PolicyName: "cognito-auth-policy-appointment",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "mobileanalytics:PutEvents",
                      "cognito-sync:*",
                      "cognito-identity:*",
                    ],
                    Resource: "*",
                  },
                  {
                    Effect: "Allow",
                    Action: ["execute-api:Invoke"],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      CognitoUnauthRole: {
        Type: "AWS::IAM::Role",
        Properties: {
          RoleName: "cognito-unauth-role-appointment",
          Path: "/",
          AssumeRolePolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: {
                  Federated: "cognito-identity.amazonaws.com",
                },
                Action: ["sts:AssumeRoleWithWebIdentity"],
                Condition: {
                  StringEquals: {
                    "cognito-identity.amazonaws.com:aud": {
                      Ref: "CognitoIdentityPool",
                    },
                  },
                  "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "unauthenticated",
                  },
                },
              },
            ],
          },
          Policies: [
            {
              PolicyName: "cognito-auth-policy-appointment",
              PolicyDocument: {
                Version: "2012-10-17",
                Statement: [
                  {
                    Effect: "Allow",
                    Action: [
                      "mobileanalytics:PutEvents",
                      "cognito-sync:*",
                      "cognito-identity:*",
                    ],
                    Resource: "*",
                  },
                ],
              },
            },
          ],
        },
      },
      CognitoIdentityPoolRoleAttachment: {
        Type: "AWS::Cognito::IdentityPoolRoleAttachment",
        Properties: {
          IdentityPoolId: { Ref: "CognitoIdentityPool" },
          Roles: {
            authenticated: { "Fn::GetAtt": ["CognitoAuthRole", "Arn"] },
            unauthenticated: { "Fn::GetAtt": ["CognitoUnauthRole", "Arn"] },
          },
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
      SQSDLQQueueArn: {
        Value: { "Fn::GetAtt": ["SQSDLQ", "Arn"] },
      },
      SQSDLQQueueUrl: {
        Value: { Ref: "SQSDLQ" },
      },
      S3BucketArn: {
        Value: { "Fn::GetAtt": ["S3Bucket", "Arn"] },
      },
      EventBusName: {
        Value: { Ref: "EventBusProject" },
      },
      NotificationTablePE: {
        Value: { Ref: "NotificationTablePE" },
      },
      NotificationTableCO: {
        Value: { Ref: "NotificationTableCO" },
      },
      NotificationTableMX: {
        Value: { Ref: "NotificationTableMX" },
      },
      NotificationTableCS: {
        Value: { Ref: "NotificationTableCS" },
      },
    },
  },
};

module.exports = serverlessConfiguration;
