import { BcryptService } from './bcryptService';
import { TokenService } from './tokenService';
import { UserService } from './userService';

const handler = async (event): Promise<any> => {
  let { email, password } = event.body;

  const user = await UserService.getUser(email);

  if (user) {
    const isMatch = await BcryptService.compare(password, user.password);

    if (isMatch) {
      const token = await TokenService.create(user.name, user.email);

      return {
        statusCode: 200,
        body: JSON.stringify({
          accessToken: token,
          refreshToken: user.refreshToken,
        }),
      };
    } else {
      return {
        statusCode: 409,
        body: "User forbidden",
      };
    }
  } else {
    return {
      statusCode: 404,
      body: "User not found",
    };
  }
};

export { handler };
