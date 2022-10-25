import * as AWS from 'aws-sdk';
import * as velocityjs from 'velocityjs';

const s3 = new AWS.S3();
const ses = new AWS.SES();

const readFile = async (template) => {
  const { bucketName, key } = template;
  const params = { Bucket: bucketName, Key: key };

  const data = await s3.getObject(params).promise();
  return data.Body.toString("utf-8");
};

const replaceAttributes = (templateContent, data) => {
  return velocityjs.render(templateContent, data);
};

const sentMail = async (source, addresses, subject, content) => {
  const params: AWS.SES.SendEmailRequest = {
    Source: source,
    Destination: {
      ToAddresses: addresses,
    },
    Message: {
      Body: {
        Html: {
          Data: content,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  console.log(params);

  await ses.sendEmail(params).promise();
};

const handler = async (event): Promise<any> => {
  const { Records } = event;

  for (const record of Records) {
    const { body } = record;
    const { source, addresses, subject, data, template } = JSON.parse(body);

    const templateContent = await readFile(template);
    const content = replaceAttributes(templateContent, data);
    await sentMail(source, addresses, subject, content);
  }

  /*
{"source": "sergiohidalgocaceres@gmail.com", "addresses": ["shidalgoc@auna.pe", "shidalgo@outlook.com"], "subject": "Confirmación de cita", "data": {"name": "Sergio", "lastname":"Hidalgo"}, "template": {"bucketName": "bucket-mails-curso04", "key":"appointments/mail-confirm.html"} }
  */

  return {
    statusCode: 200,
    body: "Email send successfully",
  };
};

export { handler };
