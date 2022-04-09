import { Column, Entity, ManyToOne } from 'typeorm';
import { ChallengeAccepted } from './ChallengeAccepted.entity';
import { Model } from './Model.abstract';
import { User } from './User.entity';
import { Comment as IComment } from '@sec/common';

console.log(Model);
@Entity()
export class Comment extends Model implements IComment {
  @Column({ length: 200 })
  text: string;

  // FIXME: Bug; Dependência circular encontrada.
  @ManyToOne(() => User /* , (user) => user.comments */)
  user: User;

  @ManyToOne(
    () => ChallengeAccepted,
    (challengeAccepted) => challengeAccepted.comments,
  )
  acceptedChallenge: ChallengeAccepted;
}
