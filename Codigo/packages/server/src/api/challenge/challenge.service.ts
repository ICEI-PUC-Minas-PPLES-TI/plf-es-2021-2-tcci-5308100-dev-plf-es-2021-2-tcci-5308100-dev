import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Challenge } from '@Models/Challenge.entity';
import { CreateChallengeDTO, UpdateChallengeDTO } from '@sec/common';
import { Explorer } from '@Models/Explorer.entity';
import { SavedFile } from '@Models/SavedFile.entity';
import { Recompense } from '@Models/Recompense.entity';

@Injectable()
export class ChallengeService extends BaseService<Challenge> {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {
    super(challengeRepository, []);
    this.challengeRepository = challengeRepository;
  }

  public async create(data: CreateChallengeDTO): Promise<Challenge> {
    const { challengedExplorerId, recompenseId, ...props } = data;
    const challenge = await super.create({
      ...props,
      challengedExplorer: <DeepPartial<Explorer>>challengedExplorerId,
      recompense: <DeepPartial<Recompense>>recompenseId,
      // cover: <DeepPartial<SavedFile>>cover,
    });
    return challenge;
  }

  public async updateById(
    id: number,
    data: UpdateChallengeDTO,
  ): Promise<Challenge> {
    const { challengedExplorerId, recompenseId, ...props } = data;

    return super.updateById(id, {
      ...props,
      challengedExplorer: <DeepPartial<Explorer>>challengedExplorerId,
      recompense: <DeepPartial<Recompense>>recompenseId,
      // cover: <DeepPartial<SavedFile>>cover,
    });
  }
}
