import { Injectable } from '@nestjs/common';
import { MoreThanOrEqual } from 'typeorm';
import { UserAccessService } from '../user-access/user-access.service';
import * as moment from 'moment';
import { groupBy } from 'rxjs';
import { AccessLast30Days, ChallengeStatus } from '@sec/common';
import { AccessLast30DaysRaw } from '@sec/common/endpoints/reports.endpoint';
import { UserService } from '../user/user.service';
import { ExplorerService } from '../explorer/explorer.service';
import { ChallengeService } from '../challenge/challenge.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly userAccessService: UserAccessService,
    private readonly userService: UserService,
    private readonly explorerService: ExplorerService,
    private readonly challengeService: ChallengeService,
  ) {}

  public async getUserAccessLast30Days(): Promise<AccessLast30Days[]> {
    const dateFormat = 'to_char("accessDate", \'YYYY-MM-DD\')';
    return (
      await this.userAccessService
        .getRepository()
        .createQueryBuilder()
        .select([dateFormat + ' AS dayOfMonth', 'count(*) as qtdAccess'])
        .where(dateFormat + ' >= :today', {
          today: moment().subtract(29, 'days').format('YYYY-MM-DD'),
        })
        .groupBy(dateFormat)
        .orderBy('dayOfMonth')
        .getRawMany<AccessLast30DaysRaw>()
    ).map(({ dayofmonth, qtdaccess }) => ({
      dayOfMonth: dayofmonth,
      qtdAccess: +qtdaccess,
    }));
  }

  public async getTotalUsers(): Promise<number> {
    return await this.explorerService.getRepository().count();
  }

  public async getTotalOpenChallenges(): Promise<number> {
    return await this.challengeService
      .getRepository()
      .count({ where: { status: ChallengeStatus.OPEN } });
  }

  public async getTotalChallenges(): Promise<number> {
    return await this.challengeService.getRepository().count();
  }
}
