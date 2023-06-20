import { Injectable, NestMiddleware } from '@nestjs/common';

// Вспомогательный редирект.
// Нужен для корректной работы с фронтом, т.к. фронт и бэк лежат на одном сервере.
// Наследуется от Nest-"прослойки" (middleware),
// которая отрабатывает на каждом запросе
@Injectable()
export class RewriteApiEndpointMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // Если у пути запроса есть "api", вырезаем
    req.url = req.url.replace(/^\/api/, '');
    // Передаем управление следующему модулю
    next();
  }
}
