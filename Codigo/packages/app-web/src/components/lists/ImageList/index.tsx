import { GenericFileType } from '@GlobalTypes';
import React from 'react';

type ImageListProps = {
  files: GenericFileType[];
  onRemoveFile?: (file: GenericFileType) => void;
  roundImages?: boolean;
};

const ImageList: React.FunctionComponent<ImageListProps> = ({ files, onRemoveFile, roundImages }) => {
  return (
    <div>
      {files.map((file) => (
        <img
          key={file.id}
          className={`m-3 ${roundImages ? 'rounded-md' : ''}`}
          style={{ maxHeight: '168px' }}
          src={file.urlPath}
          onClick={onRemoveFile ? () => onRemoveFile(file) : undefined}
        />
      ))}
    </div>
  );
};

export default ImageList;
