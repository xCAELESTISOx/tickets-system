import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { CreateUserDTO } from './dto/createUser.dto';
import { FindUserDTO } from './dto/findUser.dto';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDTO): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findOne(params: FindUserDTO): Promise<User> {
    const user = await this.usersRepository.findOne({ where: params });
    return user;
  }
}
