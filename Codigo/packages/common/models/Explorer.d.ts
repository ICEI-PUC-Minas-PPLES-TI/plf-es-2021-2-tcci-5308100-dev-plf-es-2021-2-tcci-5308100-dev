import { Challenge } from './Challenge';
import { ChallengeAccepted } from './ChallengeAccepted';
import { User } from './User';
export declare enum ExplorerStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    UNDER_REVIEW = "UNDER_REVIEW",
    BANNED = "BANNED"
}
export interface Explorer extends User {
    token: string;
    biography: string;
    favoriteProduct: string;
    instagram: string;
    tikTok: string;
    twitter: string;
    facebook: string;
    linkedIn: string;
    status: ExplorerStatus;
    acceptedChallenges: ChallengeAccepted[];
    exclusiveChallenges: Challenge[];
    countChallengeCompleted: number;
    getCountChallengeCompleted: () => number | null;
}
