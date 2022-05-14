import { ChallengeAccepted } from './ChallengeAccepted';
import { Explorer } from './Explorer';
import { Model } from './Model';
import { Recompense } from './Recompense';
import { SavedFile } from './SavedFile';

export enum ChallengeStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  DRAFT = 'DRAFT',
}

export interface Challenge extends Model {
  status: ChallengeStatus;
  title: string;
  description: string;
  cover: SavedFile;
  challengedExplorer: Explorer;
  recompense: Recompense;
  acceptedChallenges: ChallengeAccepted[];
}
