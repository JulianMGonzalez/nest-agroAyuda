import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

/* 
Un custom decorator (decorador personalizado) en NestJS es una función que permite añadir metadatos o comportamientos específicos a clases o métodos, facilitando la reutilización de código y la implementación de lógica común.
*/
export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user)
    throw new InternalServerErrorException('User not found in request');

  return data ? user[data] : user;
});
