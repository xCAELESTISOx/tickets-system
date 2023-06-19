import { Issue, IssuePriority } from '../issue.enity';

// Параметры для создания тикета
// Имплементирует часть полей из класса тикета
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
