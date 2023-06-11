import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { GetIssuesListParams, IssuesListDTO } from './dto/issuesList.dto';

import { Issue, IssuePriority, IssueStatus } from './issue.enity';
import { CreateIssueDTO } from './dto/createIssue.dto';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private readonly issuesRepository: Repository<Issue>,
  ) {}

  //
  async findAll(params: GetIssuesListParams): Promise<IssuesListDTO> {
    const { title, limit = 50, page = 1, status, priority } = params;
    const skip = limit * (page - 1);

    let queryBuilder = this.issuesRepository.createQueryBuilder('issue');

    if (title)
      queryBuilder = queryBuilder.where('issue.title like :title', {
        title: `%${title}%`,
      });

    if (status)
      queryBuilder = queryBuilder.andWhere('issue.status = :status', {
        status,
      });

    if (priority)
      queryBuilder = queryBuilder.andWhere('issue.priority = :priority', {
        priority,
      });

    const [data, totalCount] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return { data, meta: { totalCount } };
  }

  //
  create(newIssue: CreateIssueDTO): Promise<Issue> {
    const issueInstance = this.issuesRepository.create(newIssue);
    return this.issuesRepository.save(issueInstance);
  }

  //
  async updateIssueStatus(id: number, newStatus: IssueStatus) {
    const statusVariants = Object.keys(IssueStatus);

    if (!statusVariants.includes(newStatus))
      throw new HttpException(
        `You have provided wrong status value. It must be one of ${statusVariants}`,
        HttpStatus.BAD_REQUEST,
      );

    const issue = await this.issuesRepository.findOneBy({ id });

    if (!issue)
      throw new HttpException('Issue is not found', HttpStatus.NOT_FOUND);

    return this.issuesRepository.update(id, { status: newStatus });
  }

  //
  async updateIssuePriority(id: number, newPriority: IssuePriority) {
    const priorityVariants = Object.keys(IssuePriority);

    if (!priorityVariants.includes(newPriority))
      throw new HttpException(
        `You have provided wrong priority value. It must be one of ${priorityVariants}`,
        HttpStatus.BAD_REQUEST,
      );

    const issue = await this.issuesRepository.findOneBy({ id });

    if (!issue)
      throw new HttpException('Issue is not found', HttpStatus.NOT_FOUND);

    return this.issuesRepository.update(id, { priority: newPriority });
  }

  //
  async findOne(id: number): Promise<Issue> {
    const issue = await this.issuesRepository.findOneBy({ id });

    if (!issue)
      throw new HttpException('Issue is not found', HttpStatus.NOT_FOUND);

    return issue;
  }
}
