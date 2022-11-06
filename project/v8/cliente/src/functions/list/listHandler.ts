const handler = async (event: any = {}): Promise<any> => {
  const clients = [
    { name: "Client 1" },
    { name: "Client 2" },
    { name: "Client 3" },
    { name: "Client 4" },
    { name: "Client 5" },
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(clients),
  };
};

export { handler };
