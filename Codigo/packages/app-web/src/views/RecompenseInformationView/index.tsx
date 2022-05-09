import { FunctionComponent } from 'react';
import { Recompense } from '@sec/common';
import Skeleton from 'react-loading-skeleton';

type RecompenseInformationViewProps = {
  recompense?: Recompense;
};

const RecompenseInformationView: FunctionComponent<RecompenseInformationViewProps> = ({ recompense }) => {
  return (
    <div>
      <span className='text-decoration-underline'>Instruções para resgate da recompensa:</span>
      {recompense ? (
        <div>
          <strong className='d-block mb-3'>{recompense.name}</strong>
          <div style={{ whiteSpace: 'pre-line' }}>{recompense.instructions}</div>
          {/* <pre>{recompense.instructions}</pre> */}
        </div>
      ) : (
        <Skeleton height='30px' count={3} />
      )}
      <hr />
    </div>
  );
};

export default RecompenseInformationView;
