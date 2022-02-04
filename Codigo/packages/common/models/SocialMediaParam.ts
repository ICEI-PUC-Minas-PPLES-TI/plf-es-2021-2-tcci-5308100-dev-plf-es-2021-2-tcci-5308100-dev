import { Model } from './Model';
import { SocialMedia } from './SocialMedia';

export enum SocialMediaParamType {
  HASHTAG = 'HASHTAG',
  ACCOUNT = 'ACCOUNT',
}

export enum SocialMediaParamStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface SocialMediaParam extends Model {
  param: string;
  type: SocialMediaParamType;
  status: SocialMediaParamStatus;
  approveAll: boolean;
  socialMedias: SocialMedia[];
}
