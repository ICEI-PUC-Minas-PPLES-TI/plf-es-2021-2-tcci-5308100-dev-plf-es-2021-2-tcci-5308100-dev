import { Model } from './Model';
import { User, UserType } from './User';
export interface Profile extends Model {
    type: UserType;
    users: User[];
}
