import { Model } from './Model';
import { SocialMedia, SocialMediaName } from './SocialMedia';

export enum PostStatus {
  APPROVED = 'APPROVED',
  REFUSED = 'REFUSED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

export interface Post extends Model {
  status: PostStatus;
  token: string;
  url: string;
  socialMedia: SocialMedia;
  type: SocialMediaName;
}
