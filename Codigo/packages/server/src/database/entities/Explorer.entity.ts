import {
  AfterLoad,
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Challenge } from './Challenge.entity';
import { ChallengeAccepted } from './ChallengeAccepted.entity';
import { User } from './User.entity';
import {
  ChallengeAcceptedStatus,
  Explorer as IExplorer,
  ExplorerStatus,
  UserType,
} from '@sec/common';
import { SavedFile } from './SavedFile.entity';

console.log(User);
@ChildEntity(UserType.EXPLORER)
export class Explorer extends User implements IExplorer {
  constructor() {
    super();
  }

  public static avatarFilenamePrefix = (id) => `explorer-avatar-${id}`;

  @OneToOne(() => SavedFile, { cascade: true })
  @JoinColumn()
  avatar?: SavedFile;

  @Column({ nullable: true, select: false })
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

  @AfterLoad()
  getCountChallengeCompleted() {
    const countChallengeCompleted =
      this.acceptedChallenges?.reduce(
        (acc, curr) =>
          curr.status === ChallengeAcceptedStatus.COMPLETE ? ++acc : acc,
        0,
      ) || null;

    this.countChallengeCompleted = countChallengeCompleted;
    return countChallengeCompleted;
  }
}
