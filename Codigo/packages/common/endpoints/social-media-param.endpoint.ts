import { SocialMediaName } from '../models/SocialMedia';
import { SocialMediaParam, SocialMediaParamStatus, SocialMediaParamType } from '../models/SocialMediaParam';

export type GetAllSocialMediaParamsParams = {
  type?: SocialMediaParamType[];
  status?: SocialMediaParamStatus[];
  onlyApproveAll?: boolean;
  socialMedias?:SocialMediaName[]
};

export type GetAllSocialMediaParamsPayload = {
  socialMediaParams: SocialMediaParam[];
};

export type GetSocialMediaParamPayload = {
  socialMediaParam: SocialMediaParam;
};

export declare type CreateSocialMediaParamPayload = {
  socialMediaParam: SocialMediaParam;
};

export declare type UpdateSocialMediaParamPayload = {
  socialMediaParam: SocialMediaParam;
};
