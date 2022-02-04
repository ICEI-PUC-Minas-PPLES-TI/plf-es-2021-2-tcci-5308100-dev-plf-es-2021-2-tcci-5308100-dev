import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ChallengeAccepted } from './ChallengeAccepted.entity';
import { Model } from './Model';
import { SavedFile } from './SavedFile.entity';
import { ChallengeAcceptedResponse as IChallengeAcceptedResponse } from '@sec/common';

@Entity()
export class ChallengeAcceptedResponse
  extends Model
  implements ChallengeAcceptedResponse
{
  @Column({ length: 2000 })
  response: string;

  @ManyToOne(
    () => ChallengeAccepted,
    (challengeAccepted) => challengeAccepted.responses,
  )
  challengeAccepted: ChallengeAccepted;

  @OneToMany(() => SavedFile, (savedFile) => savedFile.id)
  savedFiles: SavedFile[];
}
