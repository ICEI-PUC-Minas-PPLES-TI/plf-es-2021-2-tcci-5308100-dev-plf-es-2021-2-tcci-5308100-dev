import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Challenge } from './Challenge.entity';
import { ChallengeAcceptedResponse } from './ChallengeAcceptedResponse.entity';
import { Comment } from './Comment.entity';
import { Explorer } from './Explorer.entity';
import { Model } from './Model';
import {
  ChallengeAccepted as IChallengeAccepted,
  ChallengeAcceptedStatus,
  ChallengeRecompenseStatus,
} from '@sec/common';

@Entity()
export class ChallengeAccepted extends Model implements IChallengeAccepted {
  @Column({ enum: ChallengeAcceptedStatus })
  status: ChallengeAcceptedStatus;

  @Column({ enum: ChallengeRecompenseStatus })
  recompenseStatus: ChallengeRecompenseStatus;

  @ManyToOne(() => Explorer, (explorer) => explorer.acceptedChallenges)
  explorer: Explorer;

  @ManyToOne(() => Challenge, (challenge) => challenge.acceptedChallenges)
  challenge: Challenge;

  @OneToMany(() => Comment, (comment) => comment.acceptedChallenges)
  comments: Comment[];

  @OneToMany(
    () => ChallengeAcceptedResponse,
    (challengeAcceptedResponse) => challengeAcceptedResponse.challengeAccepted,
  )
  responses: ChallengeAcceptedResponse[];
}
