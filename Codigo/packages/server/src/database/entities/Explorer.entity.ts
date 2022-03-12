import { AfterLoad, ChildEntity, Column, Entity, OneToMany } from 'typeorm';
import { Challenge } from './Challenge.entity';
import { ChallengeAccepted } from './ChallengeAccepted.entity';
import { User } from './User.entity';
import { Explorer as IExplorer, ExplorerStatus, UserType } from '@sec/common';

console.log(User);
@ChildEntity(UserType.EXPLORER)
export class Explorer extends User implements IExplorer {
  constructor() {
    super();
  }

  @Column({ nullable: true })
  token?: string;

  @Column({ nullable: true })
  biography?: string;

  @Column({ nullable: true })
  favoriteProduct?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  tikTok?: string;

  @Column({ nullable: true })
  twitter?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  linkedIn?: string;

  @Column({ enum: ExplorerStatus })
  status: ExplorerStatus;

  @OneToMany(
    () => ChallengeAccepted,
    (challengeAccepted) => challengeAccepted.explorer,
  )
  acceptedChallenges: ChallengeAccepted[];

  @OneToMany(() => Challenge, (challenge) => challenge.challengedExplorer)
  exclusiveChallenges: Challenge[];

  countChallengeCompleted: number;

  // TODO: terminar método
  @AfterLoad()
  getCountChallengeCompleted() {
    const countChallengeCompleted =
      (this.acceptedChallenges?.length || 0) +
      (this.exclusiveChallenges?.length || 0);

    this.countChallengeCompleted = countChallengeCompleted;
    return countChallengeCompleted;
  }
}
