import { Column, Entity, ManyToOne } from 'typeorm';
import { ChallengeAccepted } from './ChallengeAccepted.entity';
import { Model } from './Model';
import { User } from './User.entity';
import { Comment as IComment } from '@sec/common';

@Entity()
export class Comment extends Model implements IComment {
  @Column({ length: 200 })
  text: string;

  @ManyToOne(() => User /* , (user) => user.comments */)
  user: User;

  @ManyToOne(
    () => ChallengeAccepted,
    (challengeAccepted) => challengeAccepted.comments,
  )
  acceptedChallenges: ChallengeAccepted;
}
