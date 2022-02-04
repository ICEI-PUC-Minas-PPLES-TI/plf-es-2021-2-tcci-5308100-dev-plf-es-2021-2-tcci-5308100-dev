import { Challenge } from './Challenge';
import { ChallengeAcceptedResponse } from './ChallengeAcceptedResponse';
import { Comment } from './Comment';
import { Explorer } from './Explorer';
import { Model } from './Model';

export enum ChallengeAcceptedStatus {
  PARTICIPATING = 'PARTICIPATING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  PENDING = 'PENDING',
  COMPLETE = 'COMPLETE',
}

export enum ChallengeRecompenseStatus {
  REDEEMED = 'REDEEMED',
  WAITING = 'WAITING',
}

export interface ChallengeAccepted extends Model {
  status: ChallengeAcceptedStatus;
  recompenseStatus: ChallengeRecompenseStatus;
  explorer: Explorer;
  challenge: Challenge;
  comments: Comment[];
  responses: ChallengeAcceptedResponse[];
}
