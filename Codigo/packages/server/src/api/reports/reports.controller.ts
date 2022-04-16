import { Controller, Get, Query, Res } from '@nestjs/common';
import {
  AccessLast30Days,
  GetDashboardDataParams,
  GetDashboardDataPayload,
} from '@sec/common';
import { Response } from 'express';
import { UtilsService } from '~/utils/utils.service';
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

    const totalChallengeResponseUnderReviewPromise =
      this.reportsService.getTotalChallengeResponseUnderReview();

    const totalCommentsWithoutResponsePromise =
      this.reportsService.getTotalCommentsWithoutResponse();

    const result = await Promise.allSettled([
      accessLast30DaysPromise,
      totalUsersPromise,
      totalOpenChallengesPromise,
      totalChallengesPromise,
      totalChallengeResponseUnderReviewPromise,
      totalCommentsWithoutResponsePromise,
    ]);

    let promisesResolved = 0;
    const [
      accessLast30Days,
      totalUsers,
      totalOpenChallenges,
      totalChallenges,
      totalChallengeResponseUnderReview,
      totalCommentsWithoutResponse,
    ] = result.map((r) => {
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
        totalChallengeResponseUnderReview:
          totalChallengeResponseUnderReview as number,
        totalCommentsWithoutResponse: totalCommentsWithoutResponse as number,
        postsWithHashtags: 0,
        postsWithHashtagsLast24h: 0,
      },
    });
  }

  @Get('export/explorers')
  async exportExplorers(@Res() res: Response) {
    const csv = await this.reportsService.exportExplorersToCSV();

    res.header('Content-Type', 'text/csv');
    res.attachment('exploradores.csv');
    return res.send(csv);
  }

  @Get('export/challenges')
  async exportChallenges(@Res() res: Response) {
    const csv = await this.reportsService.exportChallengesToCSV();

    res.header('Content-Type', 'text/csv');
    res.attachment('desafios.csv');
    return res.send(csv);
  }

  @Get('export/recompenses')
  async exportRecompenses(@Res() res: Response) {
    const csv = await this.reportsService.exportRecompensesToCSV();

    res.header('Content-Type', 'text/csv');
    res.attachment('recompensas.csv');
    return res.send(csv);
  }

  @Get('export/challenges-accepted')
  async exportChallengesAccepted(@Res() res: Response) {
    const csv = await this.reportsService.exportChallengesAcceptedToCSV();

    res.header('Content-Type', 'text/csv');
    res.attachment('desafios-aceitos.csv');
    return res.send(csv);
  }
}
