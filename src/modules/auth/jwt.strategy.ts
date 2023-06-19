import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { UsersService } from '../users/users.service';
import { JWT_SECRET_KEY } from '../../consts';

// Описание "нагрузки" JWT-токена.
// Содержится в каждом токене в зашифрованном виде
export interface JwtPayload {
  id: number;
  email: string;
}

// Конфигурация работы с JWT-токеном
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // Принимает в себя сервис работы с пользователями.
  // Нужен, чтобы получать конкретного пользователя по данным из "нагрузки"
  constructor(private usersService: UsersService) {
    super({
      // Подключение JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Следим за "протуханием" токенов
      ignoreExpiration: false,
      // Секретный ключ для шифровки
      secretOrKey: JWT_SECRET_KEY,
    });
  }

  // Метод валидации пользователя
  async validate(payload: JwtPayload) {
    // Из "нагрузки" токена достаем имейл пользователя
    const { email } = payload;

    // По имейлу находим юзера
    const user = await this.usersService.findOne({ email });

    // Если юзер не найден (например, токен был поддельным) выбрасываем ошибку
    if (!user) {
      throw new UnauthorizedException();
    }

    // Если всё ок, возвращаем пользователя
    return user;
  }
}
