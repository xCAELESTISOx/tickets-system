import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Headers,
  Body,
  Res,
} from '@nestjs/common';

import { SignInDTO } from './dto/signIn.dto';
import { SignUpDTO } from './dto/signUp.dto';

import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { Response } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpData: SignUpDTO): Promise<User> {
    return this.authService.signUp(signUpData);
  }

  @Post('sign-in')
  signIn(@Body() signInData: SignInDTO): Promise<string> {
    return this.authService.signIn(signInData);
  }

  @Post('sign-out')
  signOut(@Res() res: Response, @Headers('Authorization') token: string) {
    this.authService.addTokenToBlacklist(token);
    res.clearCookie('token'); // Замените 'jwtToken' на имя вашей куки
    res.send('Logged out successfully');
  }
}
