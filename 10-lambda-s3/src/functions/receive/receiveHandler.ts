import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

const handler = async (event: any): Promise<any> => {
  const { Records } = event;

  for (const record of Records) {
    const objS3 = record.s3;
    const nameBucket = objS3.bucket.name;
    const key = objS3.object.key;

    console.log(`Bucket: ${nameBucket} - Key: ${key}`);

    const params = { Bucket: nameBucket, Key: key };

    const data = await s3.getObject(params).promise();
    const body = data.Body.toString("utf-8");

    const lines = body.split("\n");

    console.log(`Lines: ${lines.length}`);
    console.log(lines);
  }

  return {
    statusCode: 200,
    body: "CSV received",
  };
};

export { handler };
