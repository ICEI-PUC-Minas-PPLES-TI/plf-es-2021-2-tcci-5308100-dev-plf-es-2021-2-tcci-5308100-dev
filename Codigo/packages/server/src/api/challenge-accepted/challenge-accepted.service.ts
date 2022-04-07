import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Not, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { ChallengeAccepted } from '@Models/ChallengeAccepted.entity';
import { ChallengeAcceptedResponseService } from '../challenge-accepted-response/challenge-accepted-response.service';
import {
  AcceptChallengeDTO,
  AcceptResponseDTO,
  ChallengeAcceptedStatus,
  ChallengeRecompenseStatus,
  DeclineResponseDTO,
  FileType,
  SendChallengeResponseDTO,
} from '@sec/common';
import { Challenge } from '@Models/Challenge.entity';
import { Explorer } from '@Models/Explorer.entity';
import ErrorMessageToUser from '~/utils/ErrorMessageToUser';
import { CommentService } from '../comment/comment.service';
import { SavedFileService } from '../savedFile/savedFile.service';
import * as moment from 'moment';
import { FilesService } from '~/files/aws-s3.service';
import { SavedFile } from '@Models/SavedFile.entity';
import { RecompenseService } from '../recompense/recompense.service';

@Injectable()
export class ChallengeAcceptedService extends BaseService<ChallengeAccepted> {
  constructor(
    @InjectRepository(ChallengeAccepted)
    private readonly challengeAcceptedRepository: Repository<ChallengeAccepted>,
    private readonly challengeAcceptedResponseService: ChallengeAcceptedResponseService,
    private readonly commentService: CommentService,
    private readonly savedFileService: SavedFileService,
    private readonly filesService: FilesService,
    private readonly recompenseService: RecompenseService,
  ) {
    super(challengeAcceptedRepository, []);
  }

  public async getById(
    challengeAcceptedId: number,
  ): Promise<ChallengeAccepted> {
    const challengeAccepted = await this.findOne({
      where: { id: challengeAcceptedId },
      relations: [
        'challenge',
        'challenge.recompense',
        'challenge.cover',
        'responses',
        'responses.savedFiles',
      ],
    });

    if (challengeAccepted)
      challengeAccepted.comments =
        await this.commentService.getByAcceptedChallenge(challengeAcceptedId);

    return challengeAccepted;
  }

  public async acceptChallenge(
    data: AcceptChallengeDTO & {
      explorerId: number;
      files?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<ChallengeAccepted> {
    const challengeChecker = await this.find({
      where: [
        { id: data.challengeId, explorer: { id: data.explorerId } },
        { id: data.challengeId, explorer: null },
      ],
    });

    if (!challengeChecker) {
      return undefined;
      throw new ErrorMessageToUser('Desafio indisponível.');
    }

    const challengeAcceptedChecker = await this.find({
      where: { challenge: data.challengeId, explorer: { id: data.explorerId } },
    });
    if (challengeAcceptedChecker.length !== 0) {
      return undefined;
      throw new ErrorMessageToUser('Você já aceitou esse desafio.');
    }

    const challengeAccepted = await super.create({
      status: ChallengeAcceptedStatus.UNDER_REVIEW,
      recompenseStatus: ChallengeRecompenseStatus.WAITING,
      explorer: data.explorerId as DeepPartial<Explorer>,
      challenge: data.challengeId as DeepPartial<Challenge>,
    });

    const challengeResponse =
      await this.challengeAcceptedResponseService.createAndSave({
        response: data.response,
      });

    const files = await this.saveFiles(
      challengeResponse.id,
      data.images || [],
      data.files || [],
    );

    challengeResponse.savedFiles = files.success;

    challengeAccepted.responses = [challengeResponse];

    const challengeAcceptedSaved = await this.challengeAcceptedRepository.save(
      challengeAccepted,
    );

    return challengeAcceptedSaved;
  }

  public async sendChallengeResponse(
    data: SendChallengeResponseDTO & {
      explorerId: number;
      files?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
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
      relations: ['responses'],
    });

    if (!challengeAccepted) {
      return undefined;
      throw new ErrorMessageToUser('Desafio indisponível.');
    } else if (challengeAccepted.status === ChallengeAcceptedStatus.COMPLETE) {
      return undefined;
      throw new ErrorMessageToUser('Você já completou esse desafio.');
    } else {
      const challengeResponse =
        await this.challengeAcceptedResponseService.createAndSave({
          response: data.response,
        });

      const files = await this.saveFiles(
        challengeResponse.id,
        data.images || [],
        data.files || [],
      );

      challengeResponse.savedFiles = files.success;

      challengeAccepted.status = ChallengeAcceptedStatus.UNDER_REVIEW;
      challengeAccepted.responses = [
        ...challengeAccepted.responses,
        challengeResponse,
      ];

      const challengeAcceptedSaved =
        await this.challengeAcceptedRepository.save(challengeAccepted);

      return challengeAcceptedSaved;
    }
  }

  public async acceptResponse({
    challengeAcceptedId,
  }: AcceptResponseDTO): Promise<ChallengeAccepted> {
    const result = await this.getRepository().save({
      id: challengeAcceptedId,
      status: ChallengeAcceptedStatus.COMPLETE,
    });

    if (result) return await this.getById(challengeAcceptedId);
    else return undefined;
  }

  public async declineResponse({
    challengeAcceptedId,
  }: DeclineResponseDTO): Promise<ChallengeAccepted> {
    const challenge = await this.getById(challengeAcceptedId);
    if (challenge.recompenseStatus === ChallengeRecompenseStatus.REDEEMED) {
      return undefined;
      throw new ErrorMessageToUser(
        'Não é possível alterar o status. O explorador já resgatou a recompensa.',
      );
    }

    challenge.status = ChallengeAcceptedStatus.PENDING;
    const challengeUpdated = await this.getRepository().save(challenge);

    if (challengeUpdated) return challengeUpdated;
    else return undefined;
  }

  private async saveFiles(
    challengeResponseId: number,
    images: Express.Multer.File[],
    attachments: Express.Multer.File[],
  ): Promise<{
    success: SavedFile[];
    fail: SavedFile[];
  }> {
    const files = [
      ...images.map((image) => ({ type: FileType.PHOTO, file: image })),
      ...attachments.map((attachment) => ({
        type: FileType.ATTACHMENT,
        file: attachment,
      })),
    ];

    const promises = files.map(async ({ type, file }, i) => {
      const filename = this.calcFilename(challengeResponseId, type, i);
      const entity = await this.savedFileService.create({
        name: file.originalname,
        filename,
        type,
      });

      const { success } = await this.filesService.saveFileWithRetry(
        file,
        filename,
      );

      if (success) {
        return { success: true, entity: entity };
      } else {
        return { success: false, entity: undefined };
      }
    });

    const result = await Promise.all(promises);

    return result.reduce(
      (acc, { success, entity }) => {
        if (success) acc.success.push(entity);
        else acc.fail.push(entity);
        return acc;
      },
      { success: [] as SavedFile[], fail: [] as SavedFile[] },
    );
  }

  private calcFilename(id, type: FileType, count: number) {
    const prefix: { [key in FileType]: (id: any) => string } = {
      [FileType.ATTACHMENT]: ChallengeAccepted.attachmentFilenamePrefix,
      [FileType.PHOTO]: ChallengeAccepted.imageFilenamePrefix,
    };

    return `${prefix[type](id)}-${moment().format('x')}`;
  }

  async redeemChallengeAcceptedRecompense({
    challengeAcceptedId,
    explorerId,
  }: {
    challengeAcceptedId: number;
    explorerId: number;
  }) {
    const challengeAccepted = await this.findOne({
      where: {
        id: challengeAcceptedId,
        status: ChallengeAcceptedStatus.COMPLETE,
        explorer: { id: explorerId },
      },
      relations: ['challenge', 'challenge.recompense'],
    });

    if (!challengeAccepted) {
      return undefined;
      throw new ErrorMessageToUser('Desafio indisponível.');
    }

    const challengeAcceptedSaved = await this.challengeAcceptedRepository.save({
      id: challengeAcceptedId,
      recompenseStatus: ChallengeRecompenseStatus.REDEEMED,
    });

    if (!challengeAcceptedSaved) {
      return undefined;
      throw new ErrorMessageToUser(
        'Infelizmente não foi possível resgatar a recompensa. Por favor, tente novamente mais tarde.',
      );
    }

    const recompense = await this.recompenseService.findOne({
      where: {
        id: challengeAccepted.challenge.recompense.id,
      },
      select: ['name', 'instructions', 'type', 'code'],
    });

    return recompense;
  }
}
