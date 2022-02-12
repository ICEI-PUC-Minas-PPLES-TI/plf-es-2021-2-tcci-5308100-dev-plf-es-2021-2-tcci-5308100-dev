import { Model } from './Model';
import { Notification } from './Notification';
import { Profile } from './Profile';

export enum UserType {
  SUPER_ADMINISTRATOR = 'SUPER_ADMINISTRATOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
  EXPLORER = 'EXPLORER',
}

export interface User extends Model {
  nickname: string;
  email: string;
  name: string;
  profile: Profile;
  notifications: Notification[];

  //Bug; Dependência circular encontrada.
  // comments: Comment[];
}
