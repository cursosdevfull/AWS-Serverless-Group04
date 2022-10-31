import { BcryptService } from './bcryptService';
import { UserService } from './userService';

class IError extends Error {
  statusCode?: number;
}

const handler = async (event): Promise<any> => {
  let { name, email, password } = event.body;

  const user = await UserService.getUser(email);

  if (!user) {
    password = await BcryptService.hash(password);
    await UserService.register(name, email, password);

    return {
      statusCode: 200,
      body: "User registered successfully",
    };
  } else {
    return {
      statusCode: 400,
      body: "User already exists",
    };
  }
};

export { handler };
