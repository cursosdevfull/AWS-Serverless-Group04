const create = async (event): Promise<any> => {
  throw new Error("Not implemented");

  const messages = [];
  console.log("Event", event);
  for (const record of event.Records) {
    messages.push(record.body);
  }

  console.log("Received messages: ", messages);
  return { statusCode: 403, body: "An error ocurred" };
  /*  return {
    statusCode: 200,
    body: JSON.stringify(messages),
  }; */
};

export const main = create;
