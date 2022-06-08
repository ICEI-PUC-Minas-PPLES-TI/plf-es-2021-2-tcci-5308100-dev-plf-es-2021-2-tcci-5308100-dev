import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, DeepPartial, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Challenge } from '@Models/Challenge.entity';
import { CreateChallengeDTO, FileType, UpdateChallengeDTO } from '@sec/common';
import { Explorer } from '@Models/Explorer.entity';
import { SavedFile } from '@Models/SavedFile.entity';
import { Recompense } from '@Models/Recompense.entity';
import { FilesService } from '~/files/aws-s3.service';
import ErrorMessageToUser from '~/utils/ErrorMessageToUser';
import { SavedFileService } from '../savedFile/savedFile.service';
import * as moment from 'moment';

@Injectable()
export class ChallengeService extends BaseService<Challenge> {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,

    @InjectConnection()
    private readonly connection: Connection,

    private readonly filesService: FilesService,
    private readonly savedFileService: SavedFileService,
  ) {
    super(challengeRepository, []);
    this.challengeRepository = challengeRepository;
  }

  public async createAndSaveAux(
    data: CreateChallengeDTO & { newCover: Express.Multer.File },
  ): Promise<Challenge> {
    try {
      const { challengedExplorerId, recompenseId, ...props } = data;

      const challengeSaved = await this.connection.transaction(
        async (entityManager) => {
          const challenge = await super.create({
            ...props,
            challengedExplorer: <DeepPartial<Explorer>>challengedExplorerId,
            recompense: <DeepPartial<Recompense>>recompenseId,
          });

          const cover = await this.savedFileService.create({
            name: data.newCover.originalname,
            filename: this.calcFilename(challenge.id),
            type: FileType.PHOTO,
          });

          const { success } = await this.filesService.saveFile(
            data.newCover,
            cover.filename,
          );

          if (!success) {
            throw new ErrorMessageToUser(
              'Não foi possível salvar a imagem de capa do desafio.',
            );
          }

          return await entityManager.save(Challenge, {
            ...challenge,
            cover,
          });
        },
      );

      return challengeSaved;
    } catch (error) {
      return undefined;
    }
  }

  public async updateByIdAux(
    id: number,
    data: UpdateChallengeDTO & { newCover?: Express.Multer.File },
  ): Promise<Challenge> {
    const { challengedExplorerId, recompenseId, ...props } = data;

    const challenge = await this.getOneById(id);

    try {
      return await this.connection.transaction(async (entityManager) => {
        let maybePromise = null;

        if (data.newCover) {
          const filename = this.calcFilename(id);

          const { success, error } = await this.filesService.saveFile(
            data.newCover,
            filename,
          );

          if (!success) {
            throw new ErrorMessageToUser(
              'Não foi possível salvar a imagem de capa do desafio.',
            );
          } else {
            maybePromise = this.filesService.deleteFile(
              challenge.cover.filename,
            );

            challenge.cover.filename = filename;
          }
        }

        await Promise.all([maybePromise]);

        return await entityManager.save(Challenge, {
          ...props,
          id,
          challengedExplorer: <any>challengedExplorerId,
          recompense: <any>recompenseId,
          cover: challenge.cover,
        });
      });
    } catch (error) {
      if (error instanceof ErrorMessageToUser) {
        throw error;
      } else {
        return undefined;
      }
    }
  }

  public async getOneById(id: number) {
    return await this.findOneByIdWithRelations(id, [
      'recompense',
      'challengedExplorer',
      'cover',
    ]);
  }

  private calcFilename(id) {
    return `${Challenge.coverFilenamePrefix(id)}-${moment().format('x')}`;
  }
}
