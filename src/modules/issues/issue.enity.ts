import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Возможные значения приоритета тикета
export enum IssuePriority {
  LOW = 'LOW', // Несрочно
  MEDIUM = 'MEDIUM', // Некритично
  HIGH = 'HIGH', // Критично
}

// Возможные значения статуса тикета
export enum IssueStatus {
  BACKLOG = 'BACKLOG', // Бэклог
  IN_PROGRESS = 'IN_PROGRESS', // В процесс
  IN_TESTING = 'IN_TESTING', // На тестировании
  RESOLVED = 'RESOLVED', // Готово
  CANCELED = 'CANCELED', // Отменено
}

// Описание сущности Тикета в БД
// Для полей настраивается тип данных, дефолтные значения
// и доп параметры вроде Primary Key и автоматически устанавливающейся даты
// при обновлении или создании записи
@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number; // ID тикета

  @Column()
  title: string; // Заголовок тикета (краткое описание)

  @Column()
  description: string; // Подробное описание тикета

  @Column()
  reporterEmail: string; // Имейл баг-репортера

  @Column()
  reporterName: string; // Имя баг-репортера

  @Column({ default: IssuePriority.LOW, enum: IssuePriority })
  // Приоритет тикета
  // Дефолтный приоритет – Низкий (LOW)
  priority: IssuePriority;

  @Column({ default: IssueStatus.BACKLOG, enum: IssueStatus })
  // Статус тикета
  // Дефолтный статус – бэклог (BACKLOG)
  status: IssueStatus;

  @CreateDateColumn()
  createdAt: Date; // Дата создания тикета

  @UpdateDateColumn()
  updatedAt: Date; // Дата последнего обновления тикета
}
