import { Pagination } from 'modules/utiles/types';
import { Issue, IssuePriority, IssueStatus } from '../issue.enity';

// Параметры фильтрации и пагинации списка тикетов
export class GetIssuesListParams {
  title?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  limit?: number;
  page?: number;
}

// Класс, описывающий тип возвращаемых данных для списка тикетов
export class IssuesListDTO {
  data: Issue[]; // Сам список тикетов
  meta: Pagination; // Метаданные (пагинация)
}
