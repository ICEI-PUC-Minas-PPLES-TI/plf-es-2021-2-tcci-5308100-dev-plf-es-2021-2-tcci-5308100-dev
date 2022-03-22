import { GenericFileType } from '@GlobalTypes';
import React from 'react';

type ImageListProps = {
  files: GenericFileType[];
  onRemoveFile: (file: GenericFileType) => void;
};

export const ImageList: React.FunctionComponent<ImageListProps> = ({ files, onRemoveFile }) => {
  return (
    <div>
      {files.map((file) => (
        <img
          key={file.id}
          className='p-3'
          style={{ maxHeight: '200px' }}
          src={file.path}
          onClick={() => onRemoveFile(file)}
        />
      ))}
    </div>
  );
};
