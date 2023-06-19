import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { SignInDTO, SignInParams } from './dto/signIn.dto';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { JWT_SECRET_KEY } from '../../consts';
import { User, UserRole } from '../users/user.entity';

// Сервис авторизации
// Здесь описана логика взаимодействия с БД и бизнесс-логика
// При вызове роутов будут вызываться методы из этого класса
@Injectable()
export class AuthService {
  constructor(
    // Подключаем "репозиторий" User, предоставляемый TypeORM.
    // Он содержит методы работы с БД
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    // Подключаем JWT-сервис.
    // Необходим для создания токенов
    private readonly jwtService: JwtService,
  ) {}

  // Список истекших токенов
  private tokenBlacklist: Set<string> = new Set();

  // Метод добавления токена в список истекших
  addTokenToBlacklist(token: string): void {
    this.tokenBlacklist.add(token);
  }

  // Вспомогательный метод для проверки не
  // неходится ли токен протух в списке протухших
  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  // Метод регистрации пользователя.
  // Принимает в себя данные нового пользователя
  async signUp(userData: CreateUserDTO) {
    // Вытаскиваем почту и пароль пользователя
    const { email, password } = userData;

    // Проверяем предоставлен ли пароль
    // Если нет, выбрасываем ошибку
    if (!password) throw new HttpException('You must provide a password', 422);

    // Проверяем длиннее ли предоставленный пароль 8-ми символов
    // Если короче, выбрасываем ошибку
    if (password.length < 8)
      throw new HttpException('Password must be 8 digits length', 422);

    // Проверка уникальности электронной почты
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    // Если пользователь с такой почтой уже есть в системе, возвращаем ошибку
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Шифровка пароля (хэширование)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание экзмепляра пользователя с зашифрованным паролем
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    // Сохранение нового пользователя в БД
    const newUser = await this.usersRepository.save(user);

    if (newUser.id == 1) {
      // Если id нового пользователя равен 1 (первый созданный пользователь),
      // считаем его суперадмином. Иначе – неподтвержденным пользователем
      // Суперадмин в системе может быть только один
      await this.usersRepository.update(newUser.id, {
        role: UserRole.SUPERADMIN,
      });
      newUser.role = UserRole.SUPERADMIN;
    }

    // Возвращаем нового пользователя
    return newUser;
  }

  // Метод входа в систему
  // Принимает в себя логин и пароль пользователя
  async signIn(userData: SignInParams): Promise<SignInDTO> {
    // Поиск в БД пользователя с указанной почтой
    const user = await this.usersRepository.findOne({
      where: { email: userData.email },
      // Получение из данных БД только пароля, id и роли
      select: ['password', 'id', 'role'],
    });

    // Проверяем найден ли пользователь с такой почтой
    if (user) {
      // Если найден, сверяем пароли в зашифрованном виде.
      // Если пароли не совпадут, выбрасывается ошибка
      const isPasswordValid = await bcrypt.compare(
        userData.password,
        user.password,
      );

      if (isPasswordValid) {
        // Если пароль и логи верны, генерируем новый токен
        const token = this.jwtService.sign(
          // В нагрузку токена кладем почту и id пользователя
          { id: user.id, username: user.email },
          // Используем ключь для шифровки
          { secret: JWT_SECRET_KEY },
        );

        // Возвращаем токен и роль пользователя
        return { token, role: user.role };
      }
    }

    // Если пользователь с такими данными не найден, возвращаем ошибку
    throw new HttpException('No such user found', HttpStatus.BAD_REQUEST);
  }
}
