import { Model } from './Model';
import { Notification } from './Notification';
import { Profile } from './Profile';
export declare enum UserType {
    ADMINISTRATOR = "ADMINISTRATOR",
    EXPLORER = "EXPLORER"
}
export interface User extends Model {
    nickname: string;
    email: string;
    name: string;
    profile: Profile;
    notifications: Notification[];
}
