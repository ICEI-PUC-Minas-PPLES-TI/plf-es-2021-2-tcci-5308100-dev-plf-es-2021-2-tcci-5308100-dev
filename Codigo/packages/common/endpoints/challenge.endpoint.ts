import { ChallengeStatus, Challenge } from '../models/Challenge';

export type GetAllChallengesParams = {
  status?: ChallengeStatus[];
  challengedExplorer?: string;
  recompense?: string;
};

export type GetAllChallengesPayload = {
  challenges: Challenge[];
};

export type GetChallengePayload = {
  challenge: Challenge;
};
