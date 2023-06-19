import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

import 'reflect-metadata';

// Функция базового запуска приложения
async function bootstrap() {
  // Создаем экземпляр приложения
  const app = await NestFactory.create(AppModule, { cors: true });

  // Отключаем CORS (Cross-origin resource sharing),
  // чтобы мы могли без проблем обращаться к API c фронта
  app.enableCors();

  // Глобально для приложения подключаем Reflector,
  // чтобы можно было "на лету" обрабатывать некоторые данные.
  // Например, Reflector глобально отключает поле password при получении юзера,
  // чтобы он не отдавался на фронт
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Запуск приложения на порте :6060
  await app.listen(6060);
}

// Запуск приложения
bootstrap();
