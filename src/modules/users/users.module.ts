import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

// Настройка модуля работы с пользователями.
// Он будет подключаться в ядро приложения – AppModule
@Module({
  // Подключаем TypeORM модуль с пользователем и модуль JWT для проверки авторизации
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  // Подключаем контроллер ресурсов (роутов) пользователя
  controllers: [UsersController],
  // Подключаем сервис пользователя для взаимодействия с БД и бизнес логики
  providers: [UsersService],
})
export class UsersModule {}
