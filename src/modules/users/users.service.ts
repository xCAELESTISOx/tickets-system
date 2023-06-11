import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/createUser.dto';
import { FindUserDTO } from './dto/findUser.dto';

import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    const allowedRoles = Object.keys(UserRole).filter(
      (role) => role !== UserRole.SUPERADMIN,
    );

    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.role IN (:...allowedRoles)', { allowedRoles })
      .getMany();
  }

  async confirmUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user)
      throw new HttpException('User is not found', HttpStatus.NOT_FOUND);
    if (user.role === UserRole.SUPERADMIN)
      throw new HttpException(
        'You can not change Superadmin`s role',
        HttpStatus.BAD_REQUEST,
      );

    await await this.usersRepository.update(id, { role: UserRole.OPERATOR });

    user.role = UserRole.OPERATOR;

    return user;
  }

  async create(userData: CreateUserDTO): Promise<User> {
    const user = this.usersRepository.create(userData);
    const newUser = await this.usersRepository.save(user);

    if (newUser.id == 1)
      await this.usersRepository.update(newUser.id, {
        role: UserRole.SUPERADMIN,
      });

    return newUser;
  }

  async findOne(params: FindUserDTO): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: params });
    return user;
  }
}
