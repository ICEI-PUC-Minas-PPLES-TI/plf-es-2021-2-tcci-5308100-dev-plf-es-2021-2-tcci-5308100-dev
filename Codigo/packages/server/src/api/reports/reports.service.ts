import { Injectable } from '@nestjs/common';
import { UserAccessService } from '../user-access/user-access.service';
import * as moment from 'moment';
import {
  AccessLast30Days,
  ChallengeAcceptedStatus,
  ChallengeStatus,
  UserType,
} from '@sec/common';
import { AccessLast30DaysRaw } from '@sec/common/endpoints/reports.endpoint';
import { UserService } from '../user/user.service';
import { ExplorerService } from '../explorer/explorer.service';
import { ChallengeService } from '../challenge/challenge.service';
import { ChallengeAcceptedService } from '../challenge-accepted/challenge-accepted.service';
import * as ObjectToCsvParser from 'objects-to-csv';
import { RecompenseService } from '../recompense/recompense.service';

@Injectable()
export class ReportsService {
  constructor(
    private readonly userAccessService: UserAccessService,
    private readonly userService: UserService,
    private readonly explorerService: ExplorerService,
    private readonly challengeService: ChallengeService,
    private readonly challengeAcceptedService: ChallengeAcceptedService,
    private readonly recompenseService: RecompenseService,
  ) {}

  public async getUserAccessLast30Days(): Promise<AccessLast30Days[]> {
    const dateFormat = 'to_char("accessDate", \'YYYY-MM-DD\')';
    return (
      await this.userAccessService
        .getRepository()
        .createQueryBuilder()
        .select([
          dateFormat + ' AS dayOfMonth',
          'count(DISTINCT "userId") as qtdAccess',
        ])
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

  public async getTotalChallengeResponseUnderReview(): Promise<number> {
    return await this.challengeAcceptedService
      .getRepository()
      .count({ status: ChallengeAcceptedStatus.UNDER_REVIEW });
  }

  public async getTotalCommentsWithoutResponse(): Promise<number | any> {
    const challengesAccepted = await this.challengeAcceptedService
      .getRepository()
      .createQueryBuilder('challengeAccepted')
      .leftJoinAndSelect('challengeAccepted.comments', 'comments')
      .leftJoin(
        'challengeAccepted.comments',
        'next_comments',
        'comments.createdAt < next_comments.createdAt',
      )

      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')

      .where('next_comments.id IS NULL')
      .getMany();

    return challengesAccepted.reduce((acc, curr) => {
      if (
        curr.comments.length > 0 &&
        curr.comments[0].user.profile.type === UserType.EXPLORER
      ) {
        return ++acc;
      } else {
        return acc;
      }
    }, 0);
  }

  public async exportExplorersToCSV(): Promise<string> {
    const explorers = await this.explorerService.findAll();
    const csv = new ObjectToCsvParser(explorers);
    return csv.toString();
  }

  public async exportChallengesToCSV(): Promise<string> {
    const challenges = await this.challengeService.findAllWithRelations([
      'recompense',
      'challengedExplorer',
    ]);

    const csv = new ObjectToCsvParser(
      challenges.map(({ recompense, challengedExplorer, ...challenge }) => ({
        ...challenge,
        recompense: recompense.name,
        challengedExplorer: challengedExplorer?.name,
        challengedExplorerEmail: challengedExplorer?.email,
      })),
    );
    return csv.toString();
  }

  public async exportRecompensesToCSV(): Promise<string> {
    const recompenses = await this.recompenseService.findAll();
    const csv = new ObjectToCsvParser(recompenses);
    return csv.toString();
  }

  public async exportChallengesAcceptedToCSV(): Promise<string> {
    const challengesAccepted =
      await this.challengeAcceptedService.findAllWithRelations([
        'explorer',
        'challenge',
        'challenge.recompense',
        'responses',
        'comments',
      ]);

    const csv = new ObjectToCsvParser(
      challengesAccepted.map((challengesAccepted) => ({
        status: challengesAccepted.status,
        redeemed: challengesAccepted.recompenseStatus,

        explorerId: challengesAccepted.explorer.id,
        explorerName: challengesAccepted.explorer.name,
        explorerEmail: challengesAccepted.explorer.email,
        explorerStatus: challengesAccepted.explorer.status,

        challengeId: challengesAccepted.challenge.id,
        challengeName: challengesAccepted.challenge.title,
        challengeStatus: challengesAccepted.challenge.status,

        recompenseId: challengesAccepted.challenge.recompense.id,
        recompenseName: challengesAccepted.challenge.recompense.name,
        recompenseStatus: challengesAccepted.challenge.recompense.status,

        countResponses: challengesAccepted.responses.length,
        countComments: challengesAccepted.comments.length,
      })),
    );
    return csv.toString();
  }
}
