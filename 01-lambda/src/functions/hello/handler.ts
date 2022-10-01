import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  return formatJSONResponse({
    message: `Hola. Bienvenido ${event.body} al Curso de AWS Serverless`,
    event,
  });
};

export const main = middyfy(hello);
