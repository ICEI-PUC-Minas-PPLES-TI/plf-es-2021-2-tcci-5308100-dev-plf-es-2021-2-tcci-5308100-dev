import { Controller, Get, Query } from '@nestjs/common';
import {
  AccessLast30Days,
  GetDashboardDataParams,
  GetDashboardDataPayload,
} from '@sec/common';
import { UtilsService } from '~/utils/utils.service';
import { UserAccessService } from '../user-access/user-access.service';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('dashboard')
  async getDashboardData(@Query() queries: GetDashboardDataParams) {
    const accessLast30DaysPromise =
      this.reportsService.getUserAccessLast30Days();

    const totalUsersPromise = this.reportsService.getTotalUsers();

    const totalOpenChallengesPromise =
      this.reportsService.getTotalOpenChallenges();
    const totalChallengesPromise = this.reportsService.getTotalChallenges();

    const result = await Promise.allSettled([
      accessLast30DaysPromise,
      totalUsersPromise,
      totalOpenChallengesPromise,
      totalChallengesPromise,
    ]);

    let promisesResolved = 0;
    const [accessLast30Days, totalUsers, totalOpenChallenges, totalChallenges] =
      result.map((r) => {
        if (r.status === 'fulfilled') {
          promisesResolved += 1;
          return r.value;
        } else {
          return undefined;
        }
      });

    return this.utilsService.apiResponse<GetDashboardDataPayload>({
      status:
        promisesResolved === 0
          ? 'FAIL'
          : promisesResolved < result.length
          ? 'WARNING'
          : 'SUCCESS',
      message: 'Relatório: Dashboard de administração',
      payload: {
        accessLast30Days: accessLast30Days as AccessLast30Days[],
        totalUsers: totalUsers as number,
        totalOpenChallenges: totalOpenChallenges as number,
        totalChallenges: totalChallenges as number,
        postsWithHashtags: 0,
        postsWithHashtagsLast24h: 0,
      },
    });
  }
}
