import { PolicyService } from './policyService';
import { TokenService } from './tokenService';

const handler = async (event): Promise<any> => {
  let { authorizationToken, methodArn } = event;

  try {
    const payload = await TokenService.verify(authorizationToken);
    console.log("payload", payload);
    return PolicyService.generate("user", "Allow", methodArn);
  } catch (error) {
    console.log("error", error);
    return PolicyService.generate("user", "Deny", methodArn);
  }
};

export { handler };
