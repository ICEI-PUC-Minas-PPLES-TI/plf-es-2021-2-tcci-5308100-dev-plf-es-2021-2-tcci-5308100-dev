import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Challenge } from './Challenge.entity';
import { ChallengeAcceptedResponse } from './ChallengeAcceptedResponse.entity';
import { Comment } from './Comment.entity';
import { Explorer } from './Explorer.entity';
import { Model } from './Model.abstract';
import {
  ChallengeAccepted as IChallengeAccepted,
  ChallengeAcceptedStatus,
  ChallengeRecompenseStatus,
  UserType,
} from '@sec/common';

console.log(Model);
@Entity()
export class ChallengeAccepted extends Model implements IChallengeAccepted {
  public static attachmentFilenamePrefix = (id) =>
    `challenge-accepted-attachment-${id}`;
  public static imageFilenamePrefix = (id) => `challenge-accepted-image-${id}`;

  @Column({ enum: ChallengeAcceptedStatus })
  status: ChallengeAcceptedStatus;

  @Column({ enum: ChallengeRecompenseStatus })
  recompenseStatus: ChallengeRecompenseStatus;

  @ManyToOne(() => Explorer, (explorer) => explorer.acceptedChallenges)
  explorer: Explorer;

  @ManyToOne(() => Challenge, (challenge) => challenge.acceptedChallenges)
  challenge: Challenge;

  @OneToMany(() => Comment, (comment) => comment.acceptedChallenge)
  comments: Comment[];

  @OneToMany(
    () => ChallengeAcceptedResponse,
    (challengeAcceptedResponse) => challengeAcceptedResponse.challengeAccepted,
    { cascade: true },
  )
  responses: ChallengeAcceptedResponse[];

  commentsCount: { explorer: number; administrator: number };
  responsesCount: number;

  calcCommentsCount() {
    let explorer = 0;
    let administrator = 0;

    this.comments.forEach((comment) => {
      if (comment.user.profile.type === UserType.EXPLORER) explorer++;
      else if (
        [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR].includes(
          comment.user.profile.type,
        )
      )
        administrator++;
    });

    this.commentsCount = { explorer, administrator };
  }

  calcResponsesCount() {
    this.responsesCount = this.responses.length;
  }
}
