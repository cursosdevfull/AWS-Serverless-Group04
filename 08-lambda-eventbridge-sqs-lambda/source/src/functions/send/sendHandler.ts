import * as AWS from 'aws-sdk';

interface SendMessageEventBridge {
  Entries: [
    {
      Source: string;
      Detail: string;
      DetailType: string;
      EventBusName: string;
    }
  ];
}

/* 
Source: "appointment";
      Detail: "appointment-cancel";
      DetailType: "appointment.cancel";
      EventBusName: "EventBusCurso04";
*/

const eventBridge = new AWS.EventBridge();

const handler = async (event: any = {}): Promise<any> => {
  const message = {
    user: "sergio.hidalgo",
    status: "active",
    date: new Date().getTime(),
  };

  const params: SendMessageEventBridge = {
    Entries: [
      {
        Source: "appointment",
        Detail: JSON.stringify({ message }),
        DetailType: "appointment.cancel",
        EventBusName: "EventBusSQS",
      },
    ],
  };

  console.log(params);

  await eventBridge.putEvents(params).promise();

  return {
    statusCode: 200,
    body: "Message send",
  };
};

export { handler };
