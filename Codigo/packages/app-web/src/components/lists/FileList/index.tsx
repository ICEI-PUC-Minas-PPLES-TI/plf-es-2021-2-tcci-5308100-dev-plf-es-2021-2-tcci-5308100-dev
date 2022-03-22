import { GenericFileType } from '@GlobalTypes';
import React from 'react';


type FileListProps = {
  files: GenericFileType[];
  onRemoveFile: (file: GenericFileType) => void;
};

export const FileList: React.FunctionComponent<FileListProps> = ({ files, onRemoveFile }) => {
  return (
    <ul>
      {files.map((file, i) => (
        <li key={'FileList' + i + file.id}>
          <div>
            <a href={file.path} target='_blank' rel='noreferrer'>
              {file.name}&nbsp;&nbsp;
            </a>
            <a onClick={() => onRemoveFile(file)}>
              <i className='fas fa-times clickable ms-2 text-danger' />
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
};
