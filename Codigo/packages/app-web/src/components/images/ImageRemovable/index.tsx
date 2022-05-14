import React, { FunctionComponent } from 'react';

type ImageRemovableProps<T extends { urlPath: string }> = {
  imageObject: T;
  onRemove: (imageObject: T) => any;
};

// TODO: finish this
const ImageRemovable: <T extends { urlPath: string }>(props: ImageRemovableProps<T>) => JSX.Element = ({
  imageObject,
  onRemove,
}) => {
  return <div>ImageRemovable</div>;
};

export default ImageRemovable;
