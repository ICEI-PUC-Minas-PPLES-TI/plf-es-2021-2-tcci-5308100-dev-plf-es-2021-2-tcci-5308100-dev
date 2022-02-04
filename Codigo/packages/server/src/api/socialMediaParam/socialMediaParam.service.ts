import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService';
import { SocialMediaParam } from '@Models/SocialMediaParam.entity';

@Injectable()
export class SocialMediaParamService extends BaseService<SocialMediaParam> {
  constructor(
    @InjectRepository(SocialMediaParam)
    private readonly socialMediaParamRepository: Repository<SocialMediaParam>,
  ) {
    super(socialMediaParamRepository, []);
    this.socialMediaParamRepository = socialMediaParamRepository;
  }
}
