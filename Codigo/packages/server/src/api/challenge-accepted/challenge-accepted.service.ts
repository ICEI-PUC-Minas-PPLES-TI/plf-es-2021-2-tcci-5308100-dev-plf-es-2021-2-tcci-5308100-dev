import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { ChallengeAccepted } from '@Models/ChallengeAccepted.entity';
import { ChallengeAcceptedResponseService } from '../challenge-accepted-response/challenge-accepted-response.service';
import {
  AcceptChallengeDTO,
  ChallengeAcceptedStatus,
  ChallengeRecompenseStatus,
  SendChallengeResponseDTO,
} from '@sec/common';
import { Challenge } from '@Models/Challenge.entity';
import { Explorer } from '@Models/Explorer.entity';

@Injectable()
export class ChallengeAcceptedService extends BaseService<ChallengeAccepted> {
  constructor(
    @InjectRepository(ChallengeAccepted)
    private readonly challengeAcceptedRepository: Repository<ChallengeAccepted>,
    private readonly challengeAcceptedResponseService: ChallengeAcceptedResponseService,
  ) {
    super(challengeAcceptedRepository, []);
  }

  public async acceptChallenge(
    data: AcceptChallengeDTO & { explorerId: number },
  ): Promise<ChallengeAccepted> {
    const challengeAccepted = await super.create({
      status: ChallengeAcceptedStatus.UNDER_REVIEW,
      recompenseStatus: ChallengeRecompenseStatus.WAITING,
      explorer: data.explorerId as DeepPartial<Explorer>,
      challenge: data.challengeId as DeepPartial<Challenge>,
    });

    const challengeResponse =
      await this.challengeAcceptedResponseService.create({
        response: data.response,
      });

    challengeAccepted.responses = [challengeResponse];

    const challengeAcceptedSaved = await this.challengeAcceptedRepository.save(
      challengeAccepted,
    );

    return challengeAcceptedSaved;
  }

  public async sendChallengeResponse(
    data: SendChallengeResponseDTO & { explorerId: number },
  ): Promise<ChallengeAccepted | undefined> {
    const challengeAccepted = await this.findOne({
      where: {
        id: data.challengeAcceptedId,
        status: In([
          ChallengeAcceptedStatus.PENDING,
          ChallengeAcceptedStatus.UNDER_REVIEW,
        ]),
        explorer: { id: data.explorerId },
      },
    });

    if (!challengeAccepted) {
      return undefined;
    } else {
      const challengeResponse =
        await this.challengeAcceptedResponseService.create({
          response: data.response,
        });

      challengeAccepted.responses = [
        ...challengeAccepted.responses,
        challengeResponse,
      ];

      const challengeAcceptedSaved =
        await this.challengeAcceptedRepository.save(challengeAccepted);

      return challengeAcceptedSaved;
    }
  }
}
