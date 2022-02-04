import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService';
import { ChallengeAcceptedResponse } from '@Models/ChallengeAcceptedResponse.entity';

@Injectable()
export class ChallengeAcceptedResponseService extends BaseService<ChallengeAcceptedResponse> {
  constructor(
    @InjectRepository(ChallengeAcceptedResponse)
    private readonly challengeAcceptedResponseRepository: Repository<ChallengeAcceptedResponse>,
  ) {
    super(challengeAcceptedResponseRepository, []);
    this.challengeAcceptedResponseRepository = challengeAcceptedResponseRepository;
  }
}
