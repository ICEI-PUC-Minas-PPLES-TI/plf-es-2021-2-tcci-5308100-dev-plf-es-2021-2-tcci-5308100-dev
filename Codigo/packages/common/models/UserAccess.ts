import { Model } from './Model';
import { User } from './User';

export interface UserAccess extends Model {
  accessDate: Date;
  user: User;
}
