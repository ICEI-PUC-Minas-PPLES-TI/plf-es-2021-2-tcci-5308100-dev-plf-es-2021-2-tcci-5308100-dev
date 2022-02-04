import { ChallengeAccepted } from './ChallengeAccepted';
import { Explorer } from './Explorer';
import { Model } from './Model';
import { Recompense } from './Recompense';
import { SavedFile } from './SavedFile';
export declare enum ChallengeStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    DRAFT = "DRAFT"
}
export interface Challenge extends Model {
    status: ChallengeStatus;
    isHighlighted: boolean;
    title: string;
    description: string;
    cover: SavedFile;
    challengedExplorer: Explorer;
    recompense: Recompense;
    acceptedChallenges: ChallengeAccepted[];
}
