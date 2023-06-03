import { Pagination } from 'modules/utiles/types';
import { Issue } from '../issue.enity';

export class GetIssuesListParams {
  title?: string;
  limit?: number;
  page?: number;
}

export class IssuesListDTO {
  data: Issue[];
  meta: Pagination;
}
