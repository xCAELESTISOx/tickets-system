import { Pagination } from 'modules/utiles/types';
import { Issue, IssuePriority, IssueStatus } from '../issue.enity';

export class GetIssuesListParams {
  title?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  limit?: number;
  page?: number;
}

export class IssuesListDTO {
  data: Issue[];
  meta: Pagination;
}
