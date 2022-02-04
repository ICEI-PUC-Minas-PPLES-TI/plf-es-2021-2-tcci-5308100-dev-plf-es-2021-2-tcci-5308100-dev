import { ChallengeAccepted } from './ChallengeAccepted';
import { Model } from './Model';
import { User } from './User';

export interface Comment extends Model {
  text: string;
  user: User;
  acceptedChallenges: ChallengeAccepted;
}
