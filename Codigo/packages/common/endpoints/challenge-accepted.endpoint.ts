import { ChallengeAccepted, ChallengeAcceptedStatus } from '../models/ChallengeAccepted';

export type GetAllChallengesAcceptedParams = {
  status?: ChallengeAcceptedStatus[];
};

export type GetAllChallengesAcceptedPayload = {
  challengesAccepted: ChallengeAccepted[];
};

export type GetChallengeAcceptedPayload = {
  challengeAccepted: ChallengeAccepted;
};

export declare type AcceptChallengePayload = {
  challengeAccepted: ChallengeAccepted;
};

export declare type SendChallengeResponsePayload = {
  challengeAccepted: ChallengeAccepted;
};
