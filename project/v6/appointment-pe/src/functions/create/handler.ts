const create = async (event) => {
  throw new Error("Error processing message");
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

export const main = create;
