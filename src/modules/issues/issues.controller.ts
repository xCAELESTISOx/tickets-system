import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetIssuesListParams, IssuesListDTO } from './dto/issuesList.dto';
import { CreateIssueDTO } from './dto/createIssue.dto';

import { IssuesService } from './issues.service';

import { Issue, IssuePriority, IssueStatus } from './issue.enity';
import { AuthGuard } from 'utils/guards/AuthGuard';

// Контроллеров роутов для работы с тикетами
// issues – корень для этого контроллера.
// Все роуты внутри будут начинаться с этого значения
@Controller('issues')
export class IssuesController {
  // Подключение сервиса работы с тикетами
  // Внутрь могут поступать данные (например, параметры)
  // и вызываться соответствующие методы
  constructor(private readonly issuesService: IssuesService) {}

  // Декораторы Query, Param, Body используются для получения данных из запросов

  // Запрос POST /issues
  @Post()
  // Создание нового пользователя
  create(@Body() newIssue: CreateIssueDTO): Promise<Issue> {
    return this.issuesService.create(newIssue);
  }

  // Закрываем роут авторизацией.
  // Только авторизованные пользователи могут получить доступ к этому ресурсу
  @UseGuards(AuthGuard)
  // Запрос PATCH issues/<ID тикета>/status
  @Patch(':id/status')
  // Обновление статуса тикета
  updateIssueStatus(
    @Param('id') id: number,
    @Body('status') status: IssueStatus,
  ) {
    // Если статус не предоставлен, выбрасываем ошибку
    if (!status)
      throw new HttpException(
        'You must provide a status',
        HttpStatus.BAD_REQUEST,
      );

    return this.issuesService.updateIssueStatus(id, status);
  }

  // Закрываем роут авторизацией.
  // Только авторизованные пользователи могут получить доступ к этому ресурсу
  @UseGuards(AuthGuard)
  // Запрос PATCH issues/<ID тикета>/priority
  @Patch(':id/priority')
  // Обновление приоритета тикета
  updateIssuePriority(
    @Param('id') id: number,
    @Body('priority') priority: IssuePriority,
  ) {
    // Если приоритет не предоставлен, выбрасываем ошибку
    if (!priority)
      throw new HttpException(
        'You must provide a priority',
        HttpStatus.BAD_REQUEST,
      );

    return this.issuesService.updateIssuePriority(id, priority);
  }

  // Закрываем роут авторизацией.
  // Только авторизованные пользователи могут получить доступ к этому ресурсу
  @UseGuards(AuthGuard)
  // Получение тикета по ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.issuesService.findOne(id);
  }

  // Закрываем роут авторизацией.
  // Только авторизованные пользователи могут получить доступ к этому ресурсу
  @UseGuards(AuthGuard)
  // Получение списка тикетов. Може принимать в себя параметры фильтрации
  @Get()
  findAll(@Query() params: GetIssuesListParams): Promise<IssuesListDTO> {
    return this.issuesService.findAll(params);
  }
}
