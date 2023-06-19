import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssuesModule } from './modules/issues/issues.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

import 'reflect-metadata';

// Настройка модулей приложения
@Module({
  imports: [
    // Подключаем модуль ОРМ для простого взаимодействия с БД без использвания SQL
    TypeOrmModule.forRoot({
      type: 'sqlite', // Тип БД
      database: './issues-bd', // Путь к БД
      autoLoadEntities: true, // Автоподключение сущностей ОРМ, по которым создаются сущности в БД
      entities: ['./modules/*/*.entity.ts'], // Маска путей к сущностям, которые мы подгружаем автоматически
      logging: true, // Логирование запросов в консоль
      synchronize: true, // Синхронизация с приложения с БД. Например, из подключенных сущностей создаются таблицы, если их нет
      // Доп. настройки
      extra: {
        ssl: { rejectUnauthorized: false }, // Разрешаем обращаться ресурсам без SSL-сертификата
      },
    }),
    AuthModule, // Подключение модуля авторизации
    IssuesModule, // Подключение модуля тикетов
    UsersModule, // Модключение модуля пользователей
  ],
})
export class AppModule {}
