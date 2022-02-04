import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService';
import { SocialMedia } from '@Models/SocialMedia.entity';

@Injectable()
export class SocialMediaService extends BaseService<SocialMedia> {
  constructor(
    @InjectRepository(SocialMedia)
    private readonly socialMediaRepository: Repository<SocialMedia>,
  ) {
    super(socialMediaRepository, []);
    this.socialMediaRepository = socialMediaRepository;
  }
}
