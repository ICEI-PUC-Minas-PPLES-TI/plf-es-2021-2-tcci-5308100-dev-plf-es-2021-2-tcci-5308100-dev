import { ExcludeTypes } from '@sec/common';
import { FunctionComponent } from 'react';
import { Spinner, SpinnerProps } from 'react-bootstrap';

type CardLoadingProps = { animation?: SpinnerProps['animation'] } & ExcludeTypes<SpinnerProps, ['animation']>;

const CardLoading: FunctionComponent<CardLoadingProps> = ({ animation, ...props }) => {
  return (
    <div
      className='flex-center position-absolute top-0 start-0 bottom-0 end-0'
      style={{ background: 'rgba(255, 255, 255, 0.8)', zIndex: 2000 }}
    >
      <Spinner {...props} animation={animation || 'border'} />
    </div>
  );
};

export default CardLoading;
