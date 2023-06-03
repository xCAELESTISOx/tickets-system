import { Controller, Get, Param, Query } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id?: number, @Query('email') email?: string) {
    const params = { id, email };
    return this.usersService.findOne(params);
  }
}
