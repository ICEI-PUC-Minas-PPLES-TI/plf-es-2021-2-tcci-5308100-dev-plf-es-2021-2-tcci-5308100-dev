import { Model } from './Model';
export declare enum FileType {
    ATTACHMENT = "ATTACHMENT",
    PHOTO = "PHOTO"
}
export declare enum SavedFilePath {
    CHALLENGE_ACCEPTED = "CHALLENGE_ACCEPTED",
    FAQ = "FAQ",
    CHALLENGE = "CHALLENGE"
}
export interface SavedFile extends Model {
    name: string;
    filename: string;
    type: FileType;
    path: string;
    urlPath: string;
    getPath: () => string;
    getUrlPath: () => string;
}
