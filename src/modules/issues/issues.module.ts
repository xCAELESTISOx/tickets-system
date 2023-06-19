import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.enity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'modules/users/users.service';
import { JwtStrategy } from 'modules/auth/jwt.strategy';
import { User } from 'modules/users/user.entity';

// Настройка модуля работы с тикетами.
// Он будет подключаться в ядро приложения – AppModule
@Module({
  // Подключаем TypeORM модуль с тикетами и модуль JWT для проверки авторизации
  imports: [TypeOrmModule.forFeature([Issue, User]), JwtModule],
  // Подключаем контроллер ресурсов (роутов) тикетов
  controllers: [IssuesController],
  // Подключаем сервис работы с тикетами для взаимодействия с БД и бизнес логики
  // Так же подключаем сервис пользователей и JWT, т.к. модуль использует
  // проверку авторизации, которые требует описанные выше сервисы
  providers: [IssuesService, UsersService, JwtStrategy],
})
export class IssuesModule {}
