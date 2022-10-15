const handler = async (event: any): Promise<any> => {
  console.log("Received message: ", JSON.stringify(event, null, "\t"));

  /*   const messages = event.Records.map((record: any) => {
    return JSON.parse(record.Sns.Message);
  });

  console.log(messages); */

  return {
    statusCode: 200,
    body: "Hola", // JSON.stringify(messages),
  };
};

export { handler };
