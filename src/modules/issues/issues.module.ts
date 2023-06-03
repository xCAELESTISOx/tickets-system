import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.enity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
