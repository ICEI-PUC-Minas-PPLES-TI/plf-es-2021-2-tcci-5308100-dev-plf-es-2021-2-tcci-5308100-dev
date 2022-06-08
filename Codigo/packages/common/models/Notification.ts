import { Model } from './Model';
import { User } from './User';

export enum NotificationStatus {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export interface Notification extends Model {
  title: string;
  text: string;
  status: NotificationStatus;
  user: User;
}
