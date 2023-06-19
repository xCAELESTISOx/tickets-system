import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { GetIssuesListParams, IssuesListDTO } from './dto/issuesList.dto';

import { Issue, IssuePriority, IssueStatus } from './issue.enity';
import { CreateIssueDTO } from './dto/createIssue.dto';

// Сервис работы с тикетами
// Здесь описана логика взаимодействия с БД и бизнесс-логика
// При вызове роутов будут вызываться методы из этого класса
@Injectable()
export class IssuesService {
  constructor(
    // Подключаем "репозиторий" Issues, предоставляемый TypeORM.
    // Он содержит методы работы с БД
    @InjectRepository(Issue)
    private readonly issuesRepository: Repository<Issue>,
  ) {}

  // Получение списка тикетов. Принимает в себя параметры фильтрации и пагинации
  async findAll(params: GetIssuesListParams): Promise<IssuesListDTO> {
    // Достаем поля из параметров запроса
    // Для limit (лимит получаемых тикетов) дефолтное значение 50
    // Для Page (текущая страница пагинации) дефолтное значение 1
    const { title, limit = 50, page = 1, status, priority } = params;
    // Получаем отступ по строкам на основе страницы и лимита
    const skip = limit * (page - 1);

    // Создаем конструктор запроса
    let queryBuilder = this.issuesRepository.createQueryBuilder('issue');

    // Если в параметрах фильтрации указан title,
    // ищем карточки с таким заголовком
    if (title)
      queryBuilder = queryBuilder.where(
        // Чтобы поиск не был чувствителен к регистру, поле фильтрации
        // и заголовок тикета приводим к нижнему регистру
        'LOWER(issue.title) like LOWER(:title)',
        {
          // Указываем проценты по краям, чтобы можно было проводить поиск
          // не по целому слову, а по частям
          title: `%${title}%`,
        },
      );

    // Если в параметрах фильтрации указан status
    // ищем карточки с таким статусом
    if (status)
      queryBuilder = queryBuilder.andWhere('issue.status = :status', {
        status,
      });

    // Если в параметрах фильтрации указан priority
    // ищем карточки с таким приоритетом
    if (priority)
      queryBuilder = queryBuilder.andWhere('issue.priority = :priority', {
        priority,
      });

    // Получаем найденные после фильтрации тикеты общее кол-во
    // полученных тикетов
    const [data, totalCount] = await queryBuilder
      .skip(skip) // Для пагинации указываем отступ по строкам
      .take(limit) // Для пагинации указываем лимит тикетов
      .getManyAndCount();

    // Возвращаем тикеты и общее кол-во найденных после фильтрации элементов
    return { data, meta: { totalCount } };
  }

  // Создание нового тикета
  create(newIssue: CreateIssueDTO): Promise<Issue> {
    // Из полученных данных создаем экземпляр тикета
    const issueInstance = this.issuesRepository.create(newIssue);
    // Создаем в БД новую запись и возвращаем новый сохраненный объект
    return this.issuesRepository.save(issueInstance);
  }

  // Обновление статуса тикета. Принимает в себя ID тикета и новый статус
  async updateIssueStatus(id: number, newStatus: IssueStatus) {
    // Преобразуем объект статусов в список (массив)
    const statusVariants = Object.keys(IssueStatus);

    // Проверяем предоставлен ли верный новый статус.
    // Если нет, выбрасываем ошибку
    if (!statusVariants.includes(newStatus))
      throw new HttpException(
        `You have provided wrong status value. It must be one of ${statusVariants}`,
        HttpStatus.BAD_REQUEST,
      );

    // Поиск тикета, статус которого нужно обновить, по ID
    const issue = await this.issuesRepository.findOneBy({ id });

    // Если тикет с таким ID не найден, возвращаем ошибку
    if (!issue)
      throw new HttpException('Issue is not found', HttpStatus.NOT_FOUND);

    // Обновляем статус тикета в БД и возвращаем измененные данные
    return this.issuesRepository.update(id, { status: newStatus });
  }

  // Обновление приоритета тикета. Принимает в себя ID тикета и новый приоритет
  async updateIssuePriority(id: number, newPriority: IssuePriority) {
    // Преобразуем объект приоритетов в список (массив)
    const priorityVariants = Object.keys(IssuePriority);

    // Проверяем предоставлен ли верный новый приоритет.
    // Если нет, выбрасываем ошибку
    if (!priorityVariants.includes(newPriority))
      throw new HttpException(
        `You have provided wrong priority value. It must be one of ${priorityVariants}`,
        HttpStatus.BAD_REQUEST,
      );

    // Поиск тикета, статус которого нужно обновить, по ID
    const issue = await this.issuesRepository.findOneBy({ id });

    // Если тикет с таким ID не найден, возвращаем ошибку
    if (!issue)
      throw new HttpException('Issue is not found', HttpStatus.NOT_FOUND);

    // Обновляем приоритет тикета в БД и возвращаем измененные данные
    return this.issuesRepository.update(id, { priority: newPriority });
  }

  // Получение тикета по ID
  async findOne(id: number): Promise<Issue> {
    // Ищем тикет с предоставленным ID в БД
    const issue = await this.issuesRepository.findOneBy({ id });

    // Если такой тикет не найден, выбрасываем ошибку
    if (!issue)
      throw new HttpException('Issue is not found', HttpStatus.NOT_FOUND);

    // Иначе возвращаем найденный тикет
    return issue;
  }
}
