const clients = [
  { clientId: "client1", clientSecret: "secret1" },
  { clientId: "client2", clientSecret: "secret2" },
  { clientId: "client3", clientSecret: "secret3" },
  { clientId: "client4", clientSecret: "secret4" },
];

const handler = async (event): Promise<any> => {
  return {
    statusCode: 200,
    body: JSON.stringify(clients),
  };
};

export { handler };
