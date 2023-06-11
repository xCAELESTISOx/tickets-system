import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Работает только если перед применением декоратора был применен декоратор @AuthGuard
export const ContextUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    console.log(context.switchToHttp().getRequest());

    return context.switchToHttp().getRequest().user;
  },
);
