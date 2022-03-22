import { Explorer } from '../models/Explorer';
import { Recompense } from '../models/Recompense';
import { ChallengeStatus, Challenge } from '../models/Challenge';

export type GetAllChallengesParams = {
  status?: ChallengeStatus[];
  challengedExplorer?: string;
  recompense?: string;
};

export type GetAllChallengesPayload = {
  challenges: Challenge[];
};

export type GetChallengeBasePayload = {
  explorers: Explorer[];
  recompenses: Recompense[];
};

export type GetChallengePayload = {
  challenge: Challenge;
  explorers: Explorer[];
  recompenses: Recompense[];
};

export declare type CreateChallengePayload = {
  challenge: Challenge;
};

export declare type UpdateChallengePayload = {
  challenge: Challenge;
};

export type GetChallengeAsExplorerPayload = {
  challenge: Challenge;
};
