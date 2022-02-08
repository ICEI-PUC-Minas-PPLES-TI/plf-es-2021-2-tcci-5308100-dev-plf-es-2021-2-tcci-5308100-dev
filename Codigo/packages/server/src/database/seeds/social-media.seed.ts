import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ISeed from '~/database/seed.interface';
import { SocialMediaName, UserType } from '@sec/common';
import { SocialMedia } from '@Models/SocialMedia.entity';

export class SocialMediaSeed implements ISeed {
  constructor(
    @InjectRepository(SocialMedia)
    private readonly socialMediaRepository: Repository<SocialMedia>,
  ) {}

  async seed() {
    await this.socialMediaRepository.save([
      { name: SocialMediaName.INSTAGRAM },
      { name: SocialMediaName.TIKTOK },
      { name: SocialMediaName.TWITTER },
      { name: SocialMediaName.FACEBOOK },
      { name: SocialMediaName.LINKEDIN },
    ]);
  }
}
