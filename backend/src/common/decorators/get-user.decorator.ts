import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';

function getRequest(context: ExecutionContext) {
  return context.switchToHttp().getRequest();
}

export const GetUserId = createParamDecorator(
  (_: unknown, context: ExecutionContext): number | undefined =>
    getRequest(context).user?.id,
);

export const GetUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User | undefined =>
    getRequest(context).user,
);
