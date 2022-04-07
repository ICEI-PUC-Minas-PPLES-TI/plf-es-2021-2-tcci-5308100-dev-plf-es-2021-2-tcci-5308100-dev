import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Explorer } from '@Models/Explorer.entity';
import {
  AuthenticationPayload,
  ExplorerStatus,
  Token,
  UserType,
} from '@sec/common';
import { ProfileService } from '../profile/profile.service';
import { UserAccessService } from '../user-access/user-access.service';
import { AuthenticationService } from '~/authentication/authentication.service';

@Injectable()
export class ExplorerService extends BaseService<Explorer> {
  constructor(
    @InjectRepository(Explorer)
    private readonly explorerRepository: Repository<Explorer>,
    private readonly profileService: ProfileService,
    private readonly userAccessService: UserAccessService,
    private readonly authenticationService: AuthenticationService,
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

    const r = await Promise.all([saveExplorerTokenPromise, saveAccessPromise]);

    return {
      user: tokenBase,
      token: token,
    };
  }
}
