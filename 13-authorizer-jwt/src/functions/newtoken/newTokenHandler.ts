import { TokenService } from './tokenService';
import { UserService } from './userService';

const handler = async (event): Promise<any> => {
  const { refreshToken } = JSON.parse(event.body);

  const result = await UserService.getUserByRefreshToken(refreshToken);

  if (result && result.length > 0) {
    const token = await TokenService.create(result[0].name, result[0].email);
    const refreshToken = await TokenService.createRefreshToken();

    await UserService.update(result[0].email, refreshToken);

    return {
      statusCode: 200,
      body: JSON.stringify({
        accessToken: token,
        refreshToken: refreshToken,
      }),
    };
  } else {
    return {
      statusCode: 400,
      body: "Credentials are not valid",
    };
  }
};

export { handler };
