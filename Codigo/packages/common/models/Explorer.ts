import { Challenge } from './Challenge';
import { ChallengeAccepted } from './ChallengeAccepted';
import { SavedFile } from './SavedFile';
import { User } from './User';

export enum ExplorerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  BANNED = 'BANNED',
}

export interface Explorer extends User {
  avatar?: SavedFile;
  token?: string;
  background?: string;
  biography?: string;
  favoriteProduct?: string;
  instagram?: string;
  tikTok?: string;
  twitter?: string;
  facebook?: string;
  linkedIn?: string;
  status: ExplorerStatus;
  acceptedChallenges: ChallengeAccepted[];
  exclusiveChallenges: Challenge[];

  countChallengeCompleted: number;

  getCountChallengeCompleted: () => number | null;
}
