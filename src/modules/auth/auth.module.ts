import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { User } from '../users/user.entity';

import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from '../../consts';

// Настройка модуля работы авторизации.
// Он будет подключаться в ядро приложения – AppModule
@Module({
  imports: [
    // Подключаем TypeORM модуль с пользователями
    TypeOrmModule.forFeature([User]),
    // Конфигурируем модуль passport для работы JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Конфигурируем модуль JWT для работы с токенами
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: JWT_EXPIRES_IN },
    }),
  ],
  // Подключаем контроллер ресурсов (роутов) авторизации
  controllers: [AuthController],
  // Подключаем сервис пользователя, авторизации для взаимодействия с БД и бизнес логики,
  // А так же JwtStrategy для корректной работы JWT
  providers: [AuthService, UsersService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
