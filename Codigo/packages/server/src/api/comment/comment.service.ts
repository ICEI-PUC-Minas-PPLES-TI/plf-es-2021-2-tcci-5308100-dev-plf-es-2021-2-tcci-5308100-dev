import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '~/database/BaseService.abstract';
import { Comment } from '@Models/Comment.entity';
import { CreateCommentDTO } from '@sec/common';
import { ChallengeAccepted } from '@Models/ChallengeAccepted.entity';
import { Explorer } from '@Models/Explorer.entity';

@Injectable()
export class CommentService extends BaseService<Comment> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {
    super(commentRepository, []);
    this.commentRepository = commentRepository;
  }

  public async getByAcceptedChallenge(
    acceptedChallengeId: number,
  ): Promise<Comment[]> {
    return await this.commentRepository.find({
      join: {
        alias: 'comment',
        innerJoin: {
          acceptedChallenge: 'comment.acceptedChallenge',
        },
        innerJoinAndSelect: {
          user: 'comment.user',
          profile: 'user.profile',
        },
      },
      where: (query: SelectQueryBuilder<Comment>) => {
        query.where(`acceptedChallenge.id = :id`, { id: acceptedChallengeId });
      },
    });
  }

  public async getOneById(id: number): Promise<Comment> {
    return await this.commentRepository.findOne({
      join: {
        alias: 'comment',
        innerJoin: {
          acceptedChallenge: 'comment.acceptedChallenge',
        },
        innerJoinAndSelect: {
          user: 'comment.user',
          profile: 'user.profile',
        },
      },
      where: (query: SelectQueryBuilder<Comment>) => {
        query.where(`comment.id = :id`, { id });
      },
    });
  }

  public async createAndSaveAux({
    text,
    acceptedChallengeId,
    explorerId,
  }: CreateCommentDTO & { explorerId: number }): Promise<Comment> {
    const challenge = await super.create({
      text,
      acceptedChallenge: acceptedChallengeId as DeepPartial<ChallengeAccepted>,
      user: explorerId as DeepPartial<Explorer>,
    });
    return await this.commentRepository.save(challenge);
  }
}
