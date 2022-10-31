export class PolicyService {
  static generate(principalId: string, effect: string, resource: string) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };

    return {
      principalId,
      policyDocument,
    };
  }
}
