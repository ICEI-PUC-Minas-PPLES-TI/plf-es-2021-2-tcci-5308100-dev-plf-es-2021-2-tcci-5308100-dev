import { Model } from './Model';
import { SocialMedia } from './SocialMedia';
export declare enum SocialMediaParamType {
    HASHTAG = "HASHTAG",
    ACCOUNT = "ACCOUNT"
}
export declare enum SocialMediaParamStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export interface SocialMediaParam extends Model {
    param: string;
    type: SocialMediaParamType;
    status: SocialMediaParamStatus;
    approveAll: boolean;
    socialMedias: SocialMedia[];
}
