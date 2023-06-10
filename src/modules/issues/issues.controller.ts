import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetIssuesListParams, IssuesListDTO } from './dto/issuesList.dto';
import { CreateIssueDTO } from './dto/createIssue.dto';

import { IssuesService } from './issues.service';

import { Issue, IssuePriority, IssueStatus } from './issue.enity';
import { AuthGuard } from 'utils/guards/AuthGuard';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(@Body() newIssue: CreateIssueDTO): Promise<Issue> {
    return this.issuesService.create(newIssue);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/status')
  updateIssueStatus(
    @Param('id') id: number,
    @Body('status') status: IssueStatus,
  ) {
    if (!status)
      throw new HttpException(
        'You must provide a status',
        HttpStatus.BAD_REQUEST,
      );

    return this.issuesService.updateIssueStatus(id, status);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/priority')
  updateIssuePriority(
    @Param('id') id: number,
    @Body('priority') priority: IssuePriority,
  ) {
    if (!priority)
      throw new HttpException(
        'You must provide a priority',
        HttpStatus.BAD_REQUEST,
      );

    return this.issuesService.updateIssuePriority(id, priority);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.issuesService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() params: GetIssuesListParams): Promise<IssuesListDTO> {
    return this.issuesService.findAll(params);
  }
}
