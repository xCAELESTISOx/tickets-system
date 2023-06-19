import { UserRole } from 'modules/users/user.entity';

import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AuthGuard } from '../AuthGuard';

// "Гард" для защиты путей (роутов) по роли.
// Например, к какому-то роуту сможет обратиться (сделать запрос)
// только админ
// В качестве параметра принимает роль, с которой юзер может обратиться к ресурсу
const RoleGuard = (role: UserRole): Type<CanActivate> => {
  // Наследуем класс AuthGuard
  class RoleGuardMixin extends AuthGuard {
    // Создаем метод canActivate. Этот метод вызывает приложение
    // При обращении к роуту
    async canActivate(context: ExecutionContext) {
      // Прогоняем через метод родительского класса AuthGuard, проверяет авторизован ли пользователь
      // (имеет ли токен)
      await super.canActivate(context);

      // Из контекста запроса получаем параметры запроса
      const request = context.switchToHttp().getRequest();
      // Из параметров запроса получаем информацию о пользователе,
      // которую кладется туда при вызове super.canActivate (метод AuthGuard)
      const user = request.user;

      // Если роль в параметре совпадает с ролью пользователя, true – доступ разрешен,
      // иначе false – доступ закрыт
      return user?.role === role;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
