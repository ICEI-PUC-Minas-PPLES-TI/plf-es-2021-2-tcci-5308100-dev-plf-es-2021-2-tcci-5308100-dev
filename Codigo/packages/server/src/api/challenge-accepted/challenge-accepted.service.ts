import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { ChallengeAccepted } from '@Models/ChallengeAccepted.entity';

@Injectable()
export class ChallengeAcceptedService extends BaseService<ChallengeAccepted> {
  constructor(
    @InjectRepository(ChallengeAccepted)
    private readonly challengeAcceptedRepository: Repository<ChallengeAccepted>,
  ) {
    super(challengeAcceptedRepository, []);
    this.challengeAcceptedRepository = challengeAcceptedRepository;
  }
}
