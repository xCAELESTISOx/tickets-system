import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Вспомогательный декоратор для получения пользователя из параметров запроса
// Работает только если перед применением декоратора был применен декоратор @AuthGuard,
// т.к. в нем в контекст кладется необходимая информация о пользователе
export const ContextUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    // Вытаскиваем и возвращаем данные пользователя из запроса
    // Их используем в некоторых запросах
    return context.switchToHttp().getRequest().user;
  },
);
