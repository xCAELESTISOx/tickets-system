import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import RoleGuard from 'utils/guards/RoleGuard';

// Контроллеров роутов для работы с пользователями
// users – корень для этого контроллера.
// Все роуты внутри будут начинаться с этого значения
@Controller('users')
export class UsersController {
  // Подключение сервиса работы с пользователями
  // Внутрь могут поступать данные (например, параметры)
  // и вызываться соответствующие методы
  constructor(private readonly usersService: UsersService) {}

  // Декораторы Query, Param, Body используются для получения данных из запросов

  // Разрешаем доступ к роуту только админу
  @UseGuards(RoleGuard(UserRole.SUPERADMIN))
  // Запрос GET /users
  @Get()
  // Получение списка пользователей
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Разрешаем доступ к роуту только админу
  @UseGuards(RoleGuard(UserRole.SUPERADMIN))
  // Запрос DELETE /users/unconfirmed
  @Delete('/unconfirmed')
  // Удаление всех неподтвержденных пользователей
  deleteUnconfirmed() {
    return this.usersService.deleteUnconfirmed();
  }

  // Разрешаем доступ к роуту только админу
  @UseGuards(RoleGuard(UserRole.SUPERADMIN))
  // Запрос PATCH /users/<ID пользователя>/confirm
  @Patch(':id/confirm')
  // Подтверждение пользователя для доступа к сервису
  confirmUser(@Param('id') id: number): Promise<User> {
    return this.usersService.confirmUser(id);
  }

  // Запрос GET /users/<ID пользователя>
  @Get(':id')
  // Поиск пользователя по ID или email
  findOne(
    @Param('id') id?: number,
    @Query('email') email?: string,
  ): Promise<User | null> {
    // Объединяем параметры в один объект
    const params = { id, email };
    return this.usersService.findOne(params);
  }
}
