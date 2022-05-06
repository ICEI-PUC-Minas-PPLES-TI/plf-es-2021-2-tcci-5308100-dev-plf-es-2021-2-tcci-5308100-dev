import { UserType } from './models/User';

// endpoints
export * from './endpoints/administrators.endpoint';
export * from './endpoints/explorer.endpoint';
export * from './endpoints/challenge.endpoint';
export * from './endpoints/challenge-accepted.endpoint';
export * from './endpoints/recompense.endpoint';
export * from './endpoints/reports.endpoint';
export * from './endpoints/social-media-param.endpoint';
export * from './endpoints/comment.endpoint';
export * from './endpoints/social-media.endpoint';

// validators
export * from './validators/administrator.validation';
export * from './validators/explorer.validation';
export * from './validators/challenge.validation';
export * from './validators/challenge-accepted.validation';
export * from './validators/recompense.validation';
export * from './validators/social-media-param.validation';
export * from './validators/comment.validation';
export * from './validators/social-media.validation';

// models
export * from './models/Administrator';
export * from './models/Challenge';
export * from './models/ChallengeAccepted';
export * from './models/ChallengeAcceptedResponse';
export * from './models/Comment';
export * from './models/Explorer';
export * from './models/Model';
export * from './models/Notification';
export * from './models/Post';
export * from './models/Profile';
export * from './models/Recompense';
export * from './models/SavedFile';
export * from './models/SocialMedia';
export * from './models/SocialMediaParam';
export * from './models/User';
export * from './models/UserAccess';

/**
 *
 * global types
 *
 */
export type ApiResponse<T> = {
  status: 'SUCCESS' | 'FAIL' | 'WARNING';
  message: string;
  payload: T;
  error?: Error;
};

export type Token = {
  id: number;
  email: string;
  name: string;
  type: UserType;
};

export interface AuthenticationPayload {
  token: string;
  user: Token;
}

export type Indexable<T> = { [K in keyof T]: T[K] };
export type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
export type ExcludeTypes<T, R extends string[]> = Pick<T, Exclude<keyof T, R[number]>>;

// export type Path = (import { Path } from 'react-hook-form')

export type ShopifyDiscountCoupon = {
  id: string;
  code: string;
  title: string;
  shortSummary: string;
  status: string;
  asyncUsageCount: string;
  usageLimit: string;
  createdAt: string;
  startsAt: string;
  endsAt: string;
};
