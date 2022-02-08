import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Challenge } from '@Models/Challenge.entity';

@Injectable()
export class ChallengeService extends BaseService<Challenge> {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {
    super(challengeRepository, []);
    this.challengeRepository = challengeRepository;
  }
}
