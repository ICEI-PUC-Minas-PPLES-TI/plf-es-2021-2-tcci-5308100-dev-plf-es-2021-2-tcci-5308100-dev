import { Model } from './Model';

export enum FileType {
  ATTACHMENT = 'ATTACHMENT',
  PHOTO = 'PHOTO',
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
