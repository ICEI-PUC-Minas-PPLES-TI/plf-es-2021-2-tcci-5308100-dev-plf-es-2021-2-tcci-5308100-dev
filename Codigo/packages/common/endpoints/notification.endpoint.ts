import { Explorer } from '../models/Explorer';
import { Recompense } from '../models/Recompense';
import { ChallengeStatus, Challenge } from '../models/Challenge';
import { Notification } from '../models/Notification';

export type GetUserNotificationsPayload = {
  notifications: Notification[];
};
