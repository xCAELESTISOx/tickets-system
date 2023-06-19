import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

// Возможные роли пользователя
export enum UserRole {
  UNCONFIRMED = 'UNCONFIRMED', // Неподтвержден
  SUPERADMIN = 'SUPERADMIN', // Суперадмин
  OPERATOR = 'OPERATOR', // Оператор
}

// Описание сущности Юзера в БД
// Для полей настраивается тип данных, дефолтные значения
// и доп параметры вроде Primary Key и автоматически устанавливающейся даты
// при обновлении или создании записи
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; // ID пользователя

  @Column()
  firstname: string; // Имя

  @Column()
  lastname: string; // Фамилия

  @Column({ default: UserRole.UNCONFIRMED, enum: UserRole })
  role: UserRole; // Роль. По дефолту – неподтвержден

  @Column({ unique: true })
  email: string; // Почта

  // Отключение выдачи пароля при получении пользователей
  // Сделано для безопасной передачи данных
  @Exclude({ toPlainOnly: true })
  @Column({ select: false })
  password: string; // Пароль

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
