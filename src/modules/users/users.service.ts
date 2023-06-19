import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/createUser.dto';
import { FindUserDTO } from './dto/findUser.dto';

import { User, UserRole } from './user.entity';

// Сервис работы с пользователями
// Здесь описана логика взаимодействия с БД и бизнесс-логика
// При вызове роутов будут вызываться методы из этого класса
@Injectable()
export class UsersService {
  constructor(
    // Подключаем "репозиторий" User, предоставляемый TypeORM.
    // Он содержит методы работы с БД
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Получения списка пользователей
  findAll(): Promise<User[]> {
    // Список ролей, по которым будет производиться поиск
    // – все, кроме Суперадмина
    const allowedRoles = Object.keys(UserRole).filter(
      (role) => role !== UserRole.SUPERADMIN,
    );

    // Получаем и возвращаем список
    return this.usersRepository
      .createQueryBuilder('user') // Создание конструктора запросов к БД
      .where('user.role IN (:...allowedRoles)', { allowedRoles }) // Поиск пользователей по нужным ролям
      .getMany(); // Достаем весь список
  }

  // Подтверждение пользователя.
  // В качестве параметра принимает ID пользователя, которого нужно подтвердить
  // (перевести из роли UNCONFIRMED в OPERATOR)
  async confirmUser(id: number): Promise<User> {
    // Ищем в бд пользователя по предоставленному ID
    const user = await this.usersRepository.findOneBy({ id });

    // Если юзера нет, выбрасываем ошибку 404 – пользователь с таким ID не найден
    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);

    // Если роль выбранного пользователя SUPERADMIN, запрещаем операцию,
    // выбрасываем ошибку 400 – неверный запрос
    if (user.role === UserRole.SUPERADMIN)
      throw new HttpException(
        'You can not change Superadmin`s role',
        HttpStatus.BAD_REQUEST,
      );

    // Обновляем роль пользователя (переводим из роли UNCONFIRMED в OPERATOR)
    await this.usersRepository.update(id, { role: UserRole.OPERATOR });

    // Обновляем роль локально, чтобы отдать данные на фронт
    user.role = UserRole.OPERATOR;

    // Возвращаем обновленного пользователя
    return user;
  }

  // Создание нового пользователя (регистрация)
  async create(userData: CreateUserDTO): Promise<User> {
    // Создание экземпляра класса User
    const user = this.usersRepository.create(userData);
    // Создаем новую запись в БД
    const newUser = await this.usersRepository.save(user);

    // Если id нового пользователя равен 1 (первый созданный пользователь),
    // считаем его суперадмином.
    // Суперадмин в системе может быть только один
    if (newUser.id == 1)
      await this.usersRepository.update(newUser.id, {
        role: UserRole.SUPERADMIN,
      });

    // Возвращаем нового пользователя
    return newUser;
  }

  // Удаление всех неподтвержденных пользователей
  async deleteUnconfirmed() {
    // В БД находим всех неподтвержденных пользователей и удаляем их
    return this.usersRepository.delete({ role: UserRole.UNCONFIRMED });
  }

  // Поиск конкретного пользователя по ID или по email
  async findOne(params: FindUserDTO): Promise<User | null> {
    // Находим пользователя по предоставленным параметрам
    const user = await this.usersRepository.findOne({ where: params });
    // Возвращаем найденного пользователя на фронт
    return user;
  }
}
