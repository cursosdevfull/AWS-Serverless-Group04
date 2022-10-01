import * as AWS from 'aws-sdk';

const lambda = new AWS.Lambda();

const handler = async (event: any = {}): Promise<any> => {
  const result: any = await lambda
    .invoke({
      FunctionName: "destination-dev-receiver",
      InvocationType: "RequestResponse",
      Payload: JSON.stringify(event.body),
    })
    .promise();

  const payload = JSON.parse(result.Payload);
  const { name, lastname } = JSON.parse(JSON.parse(payload.body).body);
  const fullName = `${name} ${lastname}`;

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "Response received", body: fullName }),
  };
};

export { handler };
