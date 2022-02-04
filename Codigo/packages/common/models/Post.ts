import { Model } from './Model';
import { SocialMedia } from './SocialMedia';

export enum PostStatus {
  APPROVED = 'APPROVED',
  REFUSED = 'REFUSED',
}

export interface Post extends Model {
  status: PostStatus;
  token: string;
  socialMedia: SocialMedia;
}
