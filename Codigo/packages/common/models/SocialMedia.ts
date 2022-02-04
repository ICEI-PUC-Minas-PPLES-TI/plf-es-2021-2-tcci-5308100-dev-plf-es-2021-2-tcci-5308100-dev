import { Model } from './Model';
import { Post } from './Post';
import { SocialMediaParam } from './SocialMediaParam';

export enum SocialMediaName {
  INSTAGRAM = 'INSTAGRAM',
  TIKTOK = 'TIKTOK',
  TWITTER = 'TWITTER',
  FACEBOOK = 'FACEBOOK',
  LINKEDIN = 'LINKEDIN',
}

export interface SocialMedia extends Model {
  name: SocialMediaName;
  posts: Post[];
  socialMediaParams: SocialMediaParam[];
}
