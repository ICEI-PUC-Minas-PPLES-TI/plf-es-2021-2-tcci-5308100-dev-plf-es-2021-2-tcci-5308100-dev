import { ChallengeAccepted } from './ChallengeAccepted';
import { Model } from './Model';
import { SavedFile } from './SavedFile';
export interface ChallengeAcceptedResponse extends Model {
    response: string;
    challengeAccepted: ChallengeAccepted;
    savedFiles: SavedFile[];
}
