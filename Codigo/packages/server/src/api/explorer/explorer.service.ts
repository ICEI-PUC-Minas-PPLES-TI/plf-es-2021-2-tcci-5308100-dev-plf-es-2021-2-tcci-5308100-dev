import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Explorer } from '@Models/Explorer.entity';
import {
  AuthenticationPayload,
  ExplorerStatus,
  FileType,
  Token,
  UpdateExplorerProfileDTO,
  UserType,
} from '@sec/common';
import { ProfileService } from '../profile/profile.service';
import { UserAccessService } from '../user-access/user-access.service';
import { AuthenticationService } from '~/authentication/authentication.service';
import { FilesService } from '~/files/aws-s3.service';
import * as moment from 'moment';
import ErrorMessageToUser from '~/utils/ErrorMessageToUser';
import { SavedFileService } from '../savedFile/savedFile.service';
import { SavedFile } from '@Models/SavedFile.entity';

@Injectable()
export class ExplorerService extends BaseService<Explorer> {
  constructor(
    @InjectRepository(Explorer)
    private readonly explorerRepository: Repository<Explorer>,
    private readonly profileService: ProfileService,
    private readonly userAccessService: UserAccessService,
    private readonly authenticationService: AuthenticationService,
    private readonly filesService: FilesService,
    private readonly savedFileService: SavedFileService,

    @InjectConnection()
    private readonly connection: Connection,
  ) {
    super(explorerRepository, []);
    this.explorerRepository = explorerRepository;
  }

  public async saveNewExplorer({
    email,
    name,
  }: {
    email: string;
    name: string;
  }): Promise<Explorer> {
    const explorerProfile = await this.profileService.findOne({
      type: UserType.EXPLORER,
    });

    return await this.createAndSave({
      nickname: name,
      email: email,
      name: name,
      profile: explorerProfile,
      status: ExplorerStatus.ACTIVE,
    });
  }

  public async createExplorerToken(
    explorer: Explorer,
    shopifyToken: string,
  ): Promise<AuthenticationPayload> {
    const saveExplorerTokenPromise = this.updateById(explorer.id, {
      token: shopifyToken,
    });
    const saveAccessPromise = this.userAccessService.saveAccess(explorer.id);

    const tokenBase: Token = {
      id: explorer.id,
      email: explorer.email,
      name: explorer.name,
      type: explorer.profile.type,
    };

    const { token } = this.authenticationService.createToken(tokenBase);

    await Promise.all([saveExplorerTokenPromise, saveAccessPromise]);

    return {
      user: tokenBase,
      token: token,
    };
  }

  public async updateExplorerProfile(
    id: number,
    data: UpdateExplorerProfileDTO & { newAvatar?: Express.Multer.File },
  ): Promise<Explorer | undefined> {
    const { newAvatar, avatarId, ...props } = data;

    const explorer = await this.findOneByIdWithRelations(id, ['avatar']);

    try {
      return await this.connection.transaction(async (entityManager) => {
        const maybePromise = [];

        if (!avatarId && explorer.avatar) {
        }

        if (newAvatar) {
          const filename = this.calcFilename(id);

          const { success, error } = await this.filesService.saveFile(
            newAvatar,
            filename,
          );

          if (!success) {
            throw new ErrorMessageToUser(
              'Não foi possível salvar a imagem de capa do desafio.',
            );
          } else if (explorer.avatar) {
            maybePromise.push(
              this.filesService.deleteFile(explorer.avatar.filename),
            );

            explorer.avatar.name = data.newAvatar.originalname;
            explorer.avatar.filename = filename;
          } else {
            explorer.avatar = await entityManager.create(SavedFile, {
              name: data.newAvatar.originalname,
              filename: filename,
              type: FileType.PHOTO,
            });
          }

          explorer.avatar.getUrlPath();
        } else if (!newAvatar && !avatarId && explorer.avatar) {
          await entityManager.save(Explorer, {
            ...props,
            id,
            avatar: null,
          });

          maybePromise.push(
            this.filesService.deleteFile(explorer.avatar.filename),
          );

          maybePromise.push(
            entityManager.delete(SavedFile, { id: explorer.avatar.id }),
          );

          explorer.avatar = null;
        }

        await Promise.all(maybePromise);

        return await entityManager.save(Explorer, {
          ...props,
          id,
          avatar: explorer.avatar,
        });
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorMessageToUser) {
        throw error;
      } else {
        return undefined;
      }
    }
  }

  private calcFilename(id) {
    return `${Explorer.avatarFilenamePrefix(id)}-${moment().format('x')}`;
  }
}
