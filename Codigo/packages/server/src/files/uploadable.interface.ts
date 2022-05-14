import {
  DeleteObjectCommandOutput,
  DeleteObjectsCommandOutput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

export type FileServiceResult<T> =
  | { success: true; data: T; error: undefined }
  | { success: false; error: any; data: undefined };

export type FileValidityOptions = {
  allowedMimeType?: string[];
  maxSize?: number;
};

export interface Uploadable {
  checkFileValidity: (
    file: Express.Multer.File,
    options?: FileValidityOptions,
  ) => boolean;

  saveFile: (
    file: Express.Multer.File,
    filename?: string,
  ) => Promise<FileServiceResult<PutObjectCommandOutput>>;

  deleteFile: (
    filename: string,
  ) => Promise<FileServiceResult<DeleteObjectCommandOutput>>;

  deleteFiles: (
    filenames: string[],
  ) => Promise<FileServiceResult<DeleteObjectsCommandOutput>>;
}
