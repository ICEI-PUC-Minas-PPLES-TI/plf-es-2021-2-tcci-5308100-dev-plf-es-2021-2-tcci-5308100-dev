import { Model } from './Model';
import { Notification } from './Notification';
import { Profile } from './Profile';

export enum UserType {
  SUPER_ADMINISTRATOR = 'SUPER_ADMINISTRATOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  EXPLORER = 'EXPLORER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_REVIEW = 'UNDER_REVIEW',
  BANNED = 'BANNED',
}

export interface User extends Model {
  status: string;
  nickname: string;
  email: string;
  name: string;
  profile: Profile;
  notifications: Notification[];

  //Bug; Dependência circular encontrada.
  // comments: Comment[];
}
