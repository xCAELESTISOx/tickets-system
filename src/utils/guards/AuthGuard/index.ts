import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'consts';
import { Request } from 'express';
import { UserRole } from 'modules/users/user.entity';
import { UsersService } from 'modules/users/users.service';

// "Гард" авторизации. Проверяет есть ли у пользователя JWT-токен
// и есть ли этот пользователь в системе.
// Имплементирует интерфейс CanActivate для типизации метода canActivate
@Injectable()
export class AuthGuard implements CanActivate {
  // В конструкторе указываем сервисы, которые будем использовать для проверки авторизации
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // Метод проверки может ли пользователь обратиться к ресурсу.
  // Принимает в себя контекст запроса, который приложение кладет само
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Из контекста запроса получаем параметры запроса
    const request = context.switchToHttp().getRequest();
    // Из параметра запроса получаем JWT-токен авторизации
    const token = this.extractTokenFromHeader(request);

    // Если токена нет, сразу выбрасываем ошибку 401 – не авторизован.
    // В таком случае дальнейшие проверки не выполняются
    if (!token) {
      throw new UnauthorizedException();
    }

    //
    let payload;

    try {
      // С помощью JWT-сервиса расшифровываем токен и получаем из него "нагрузку" токена
      // Там находится имейл пользователя и его ID, их кладем в payload
      payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_KEY,
      });
    } catch (err) {
      // Если при расшифровке происзошла ошибка (например, токен поддельный)
      // Выбрасываем ошибку 401 – не авторизован
      throw new UnauthorizedException(err);
    }

    // По полученной нагрузке, а именно ID, находим пользователя
    const user = await this.usersService.findOne({
      id: payload.id,
    });

    // Если такой пользователь не найден, выбрасываем ошибку 401 – не авторизован
    if (!user) throw new UnauthorizedException();

    // Если пользователь всё же нашелся, проверяем роль
    // Если роль пользователя "Не подвтержден" (UNCONFIRMED),
    // Возвращаем ошибку 403 – доступ к ресурсу закрыт для данного пользователя
    if (user.role === UserRole.UNCONFIRMED)
      throw new HttpException(
        'Your account must be verified by an operator to fulfill this request',
        HttpStatus.FORBIDDEN,
      );

    // В параметры запроса кладем пользователя. Он нужен в гарде RoleGuard
    // для получения информации о пользователе при проверке роли
    request['user'] = user;

    // Если на прошлых стадиях ошибок не произошло, возвращаем true
    // – доступ авторизован и может выполнить запрос
    return true;
  }

  // Вспомогательный метод для получения JWT-токена из параметров запроса
  private extractTokenFromHeader(request: Request): string | undefined {
    // Из параметров запроса достаем поле authorization и, разрубив по пробелу пополам,
    // получаем оттуда тип токена и сам токен.
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // Если тип токена Bearer, возвращаем токен. Если токен окажется пустым, в методе canActivate выпадет ошибка 401
    return type === 'Bearer' ? token : undefined;
  }

  // Пример токена – "Bearer 98fd9as9dasd99h9.anl328dlaadsc838.pckaakg23112d9"
}
