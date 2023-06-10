import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum IssueStatus {
  BACKLOG = 'BACKLOG',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_TESTING = 'IN_TESTING',
  RESOLVED = 'RESOLVED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  reporterEmail: string;

  @Column()
  reporterName: string;

  @Column({ default: IssuePriority.LOW, enum: IssuePriority })
  priority: IssuePriority;

  @Column({ default: IssueStatus.BACKLOG, enum: IssueStatus })
  status: IssueStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
