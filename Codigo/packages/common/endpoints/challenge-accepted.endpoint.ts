import { Comment } from '../models/Comment';
import { ChallengeAccepted, ChallengeAcceptedStatus } from '../models/ChallengeAccepted';
import { Recompense } from '../models/Recompense';

export type GetAllChallengesAcceptedParams = {
  status?: ChallengeAcceptedStatus[];
};

export type GetAllChallengesAcceptedPayload = {
  challengesAccepted: ChallengeAccepted[];
};

export type GetChallengeAcceptedPayload = {
  challengeAccepted: ChallengeAccepted;
};

export type AcceptChallengePayload = {
  challengeAccepted: ChallengeAccepted;
};

export type SendChallengeResponsePayload = {
  challengeAccepted: ChallengeAccepted;
};

export type RedeemRecompensePayload = {
  recompense: Recompense;
};

export type GetReadOnlyChallengeAcceptedPayload = {
  challengeAccepted: ChallengeAccepted;
};
