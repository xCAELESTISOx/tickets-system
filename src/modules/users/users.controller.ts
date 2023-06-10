import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { User, UserRole } from './user.entity';
import RoleGuard from 'utils/guards/RoleGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RoleGuard(UserRole.SUPERADMIN))
  @Patch(':id/confirm')
  confirmUser(@Param('id') id: number): Promise<User> {
    return this.usersService.confirmUser(id);
  }

  @Get(':id')
  findOne(
    @Param('id') id?: number,
    @Query('email') email?: string,
  ): Promise<User | null> {
    const params = { id, email };
    return this.usersService.findOne(params);
  }
}
