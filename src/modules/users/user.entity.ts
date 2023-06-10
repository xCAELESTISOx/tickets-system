import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
  UNCONFIRMED = 'UNCONFIRMED',
  SUPERADMIN = 'SUPERADMIN',
  OPERATOR = 'OPERATOR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ default: UserRole.UNCONFIRMED, enum: UserRole })
  role: UserRole;

  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
