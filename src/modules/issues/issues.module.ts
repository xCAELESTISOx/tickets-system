import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.enity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'modules/users/users.service';
import { JwtStrategy } from 'modules/auth/jwt.strategy';
import { User } from 'modules/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, User]), JwtModule],
  controllers: [IssuesController],
  providers: [IssuesService, UsersService, JwtStrategy],
})
export class IssuesModule {}
