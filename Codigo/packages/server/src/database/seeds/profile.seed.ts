import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ISeed from '~/database/seed.interface';
import { UserType } from '@sec/common';
import { Profile } from '@Models/Profile.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileSeed implements ISeed {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async seed() {
    const profiles = await this.profileRepository.save([
      { id: 1, type: UserType.SUPER_ADMINISTRATOR },
      { id: 2, type: UserType.ADMINISTRATOR },
      { id: 3, type: UserType.EXPLORER },
    ]);

    await this.profileRepository.update(
      { id: profiles[0].id },
      { ...profiles[0], id: 1 },
    );

    await this.profileRepository.update(
      { id: profiles[1].id },
      { ...profiles[1], id: 2 },
    );

    console.log(profiles);
  }
}
