import { Issue, IssuePriority } from '../issue.enity';

export class CreateIssueDTO
  implements
    Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'priority'>
{
  title: string;
  description: string;
  reporterEmail: string;
  reporterName: string;
  priority?: IssuePriority;
}
