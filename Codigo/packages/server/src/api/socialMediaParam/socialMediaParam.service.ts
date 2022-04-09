import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { SocialMediaParam } from '@Models/SocialMediaParam.entity';
import {
  CreateSocialMediaParamDTO,
  UpdateSocialMediaParamDTO,
} from '@sec/common';
import { SocialMedia } from '@Models/SocialMedia.entity';

@Injectable()
export class SocialMediaParamService extends BaseService<SocialMediaParam> {
  constructor(
    @InjectRepository(SocialMediaParam)
    private readonly socialMediaParamRepository: Repository<SocialMediaParam>,
  ) {
    super(socialMediaParamRepository, []);
    this.socialMediaParamRepository = socialMediaParamRepository;
  }

  public async create(
    data: CreateSocialMediaParamDTO,
  ): Promise<SocialMediaParam> {
    const { socialMediaIds, ...rest } = data;
    const socialMediaParam = await super.create(rest);

    socialMediaParam.socialMedias = socialMediaIds.map((socialMediaId) => ({
      id: socialMediaId,
      socialMediaParams: socialMediaParam.id,
    })) as any;

    return socialMediaParam;
  }

  public async updateById(
    id: number,
    data: UpdateSocialMediaParamDTO,
  ): Promise<SocialMediaParam> {
    const { socialMediaIds, ...rest } = data;

    return super.updateById(id, {
      ...rest,
      socialMedias: socialMediaIds.map((socialMediaId) => ({
        id: socialMediaId,
        socialMediaParams: id,
      })) as any,
    });
  }
}
