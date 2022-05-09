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

console.log('Explorer :>>', User);
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

  @Column({ nullable: true, length: 40 })
  biography?: string;

  @Column({ nullable: true, length: 30 })
  favoriteProduct?: string;

  @Column({ nullable: true, length: 20 })
  instagram?: string;

  @Column({ nullable: true, length: 20 })
  tikTok?: string;

  @Column({ nullable: true, length: 20 })
  twitter?: string;

  @Column({ nullable: true, length: 20 })
  facebook?: string;

  @Column({ nullable: true, length: 20 })
  linkedIn?: string;

  // @Column({ type: 'enum', enum: ExplorerStatus })
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
    if (Array.isArray(this.acceptedChallenges)) {
      const countChallengeCompleted = this.acceptedChallenges.reduce(
        (acc, curr) =>
          curr.status === ChallengeAcceptedStatus.COMPLETE ? ++acc : acc,
        0,
      );

      this.countChallengeCompleted = countChallengeCompleted;
      return countChallengeCompleted;
    } else {
      this.countChallengeCompleted = null;
      return null;
    }
  }
}
