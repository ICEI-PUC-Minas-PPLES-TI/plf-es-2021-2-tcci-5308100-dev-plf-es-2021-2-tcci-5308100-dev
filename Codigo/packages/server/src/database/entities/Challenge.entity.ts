import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ChallengeAccepted } from './ChallengeAccepted.entity';
import { Explorer } from './Explorer.entity';
import { Model } from './Model.abstract';
import { Recompense } from './Recompense.entity';
import { SavedFile } from './SavedFile.entity';
import { Challenge as IChallenge, ChallengeStatus } from '@sec/common';

console.log(Model);
@Entity()
export class Challenge extends Model implements IChallenge {
  @Column({ enum: ChallengeStatus })
  status: ChallengeStatus;

  @Column()
  isHighlighted: boolean;

  @Column()
  title: string;

  @Column({ length: 2000 })
  description: string;

  @OneToOne(() => SavedFile)
  @JoinColumn()
  cover: SavedFile;

  @ManyToOne(() => Explorer, (explorer) => explorer.exclusiveChallenges)
  challengedExplorer: Explorer;

  @ManyToOne(() => Recompense, (recompense) => recompense.challenges)
  recompense: Recompense;

  @OneToMany(
    () => ChallengeAccepted,
    (challengeAccepted) => challengeAccepted.challenge,
  )
  acceptedChallenges: ChallengeAccepted[];
}