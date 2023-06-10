import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from 'consts';
import { Request } from 'express';
import { UserRole } from 'modules/users/user.entity';
import { UsersService } from 'modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let payload;

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET_KEY,
      });
    } catch (err) {
      throw new UnauthorizedException(err);
    }

    const user = await this.usersService.findOne({
      id: payload.id,
    });

    if (!user) throw new UnauthorizedException();
    console.log(user);

    if (user.role === UserRole.UNCONFIRMED)
      throw new HttpException(
        'Your account must be verified by an operator to fulfill this request',
        HttpStatus.FORBIDDEN,
      );

    request['user'] = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
