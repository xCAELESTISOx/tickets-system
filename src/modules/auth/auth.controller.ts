import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Headers,
  Body,
  Res,
} from '@nestjs/common';

import { SignInDTO, SignInParams } from './dto/signIn.dto';
import { SignUpDTO } from './dto/signUp.dto';

import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { Response } from 'express';

// Контроллеров роутов для работы с пользователями
// auth – корень для этого контроллера.
// Все роуты внутри будут начинаться с этого значения
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    // Подключение сервиса работы авторизации
    // Внутрь могут поступать данные (например, параметры)
    // и вызываться соответствующие методы
    private readonly authService: AuthService,
  ) {}

  // Запрос POST /auth/sign-up
  @Post('sign-up')
  // Регистрация пользователя.
  // Принимает в себя данные для регистрации (имя, почта, пароль и т.д.)
  signUp(@Body() signUpData: SignUpDTO): Promise<User> {
    return this.authService.signUp(signUpData);
  }

  // Запрос POST /auth/sign-in
  @Post('sign-in')
  // Вход в систему.
  // Принимает в себя логин и пароль пользователя
  signIn(@Body() signInData: SignInParams): Promise<SignInDTO> {
    return this.authService.signIn(signInData);
  }

  // Запрос POST /auth/sign-out
  @Post('sign-out')
  // Выход из системы
  signOut(@Res() res: Response, @Headers('Authorization') token: string) {
    this.authService.addTokenToBlacklist(token);
    // Забираем у пользователя token из куков
    res.clearCookie('token');
    // Сообщаем об успешном выходе из системы
    res.send('Logged out successfully');
  }
}
