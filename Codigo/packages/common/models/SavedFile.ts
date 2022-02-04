import { Model } from './Model';

export enum FileType {
  ATTACHMENT = 'ATTACHMENT',
  PHOTO = 'PHOTO',
}

export enum SavedFilePath {
  CHALLENGE_ACCEPTED = 'CHALLENGE_ACCEPTED',
  FAQ = 'FAQ',
  CHALLENGE = 'CHALLENGE',
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
