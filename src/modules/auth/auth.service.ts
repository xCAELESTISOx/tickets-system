import {
  ConflictException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignInDTO } from './dto/signIn.dto';
import { CreateUserDTO } from '../users/dto/createUser.dto';
import { JWT_SECRET_KEY } from '../../consts';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private tokenBlacklist: Set<string> = new Set();

  addTokenToBlacklist(token: string): void {
    this.tokenBlacklist.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  async signUp(userData: CreateUserDTO) {
    const { email, password } = userData;
    if (!password) throw new HttpException('You must provide a password', 422);

    if (password.length < 8)
      throw new HttpException('Password must be 8 digits length', 422);

    // Проверка уникальности электронной почты
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return await this.usersRepository.save(user);
  }

  /**  */
  async signIn(userData: SignInDTO): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email: userData.email },
      select: ['password', 'id'],
    });

    // Check if the user exists
    if (user) {
      // Verify the password
      const isPasswordValid = await bcrypt.compare(
        userData.password,
        user.password,
      );

      if (isPasswordValid) {
        // Generate a JWT token
        const token = this.jwtService.sign(
          { id: user.id, username: user.email },
          { secret: JWT_SECRET_KEY },
        );

        return token;
      }
    }

    throw new UnauthorizedException();
  }
}
