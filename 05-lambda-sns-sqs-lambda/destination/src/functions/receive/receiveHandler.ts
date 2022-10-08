const handler = async (event: any): Promise<any> => {
  console.log(event);

  const messages = [];
  for (const record of event.Records) {
    const body = JSON.parse(record.body);
    const message = JSON.parse(body.Message);
    messages.push(message);
  }

  console.log("Received messages: ", messages);

  return {
    statusCode: 200,
    body: JSON.stringify(messages),
  };
};

export { handler };
