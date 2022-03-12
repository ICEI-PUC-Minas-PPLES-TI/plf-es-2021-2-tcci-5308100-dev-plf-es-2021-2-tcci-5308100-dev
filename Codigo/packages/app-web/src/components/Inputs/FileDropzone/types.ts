import { ExcludeTypes } from '@GlobalTypes';
import { SavedFile } from '@sec/common';
import { CSSProperties } from 'react';

export interface FileCustomInterface {
  name: string;
  path: string;
  isNew: boolean;
}

export type NewFile = { file: File; isNew: true } & FileCustomInterface;

export type SavedFileAux = { isNew: false } & SavedFile & FileCustomInterface;
export type SavedFileAuxSchema = { isNew: false } & ExcludeTypes<
  SavedFile,
  ['getPath', 'getUrlPath']
> &
  FileCustomInterface;

export type FileMixed = NewFile | SavedFileAux;
export type FileMixedSchema = NewFile | SavedFileAuxSchema;

export type FileCustom<T extends boolean> = T extends true
  ? NewFile
  : FileMixed;

export type FileDropzoneSingle = {
  singleFile: true;
  file: FileMixed | FileMixedSchema | undefined;
  onAcceptFile: (file: NewFile) => void;
};

export type FileDropzoneMultiple = {
  singleFile?: false;
  files: FileMixed[];
  onAcceptFile: (file: NewFile[]) => void;
};

export type FileDropzoneProps = (FileDropzoneSingle | FileDropzoneMultiple) & {
  label?: string;
  singleFile?: boolean;
  maxHeight?: CSSProperties['height'];
  onRemoveFile: (file: FileMixed) => void;
  mimeTypes?: string[];
  hasError?: boolean;
};
