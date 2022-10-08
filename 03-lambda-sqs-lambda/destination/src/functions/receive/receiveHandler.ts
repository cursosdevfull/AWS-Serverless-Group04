const handler = async (event: any): Promise<any> => {
  const messages = [];
  for (const record of event.Records) {
    messages.push(record.body);
  }

  console.log("Received messages: ", messages);

  return {
    statusCode: 200,
    body: JSON.stringify(messages),
  };
};

export { handler };
