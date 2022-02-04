import { Model } from './Model';
import { User } from './User';
export declare enum NotificationStatus {
    READ = "READ",
    UNREAD = "UNREAD"
}
export interface Notification extends Model {
    text: string;
    status: NotificationStatus;
    user: User;
}
