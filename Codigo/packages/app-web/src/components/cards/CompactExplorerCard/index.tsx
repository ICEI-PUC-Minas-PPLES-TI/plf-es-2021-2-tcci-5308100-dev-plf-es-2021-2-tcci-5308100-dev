import { Explorer } from '@sec/common';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

type CompactExplorerCardProps = {
  explorer: Explorer;
};

const CompactExplorerCard: FunctionComponent<CompactExplorerCardProps> = ({ explorer }) => {
  return (
    <div
      className='card rounded-md my-3 d-flex align-items-center position-relative overflow-hidden'
      style={{ width: '200px', height: '240px' }}
    >
      <div
        className='d-flex align-items-center p-2 w-100 h-100 justify-content-center flex-column text-center'
        style={{ zIndex: 2 }}
      >
        {explorer.avatar ? (
          <img className='rounded-circle avatar-size-md' src={explorer.avatar.urlPath} />
        ) : (
          <div className='rounded-circle overflow-hidden flex-center align-items-start avatar-size-md border-grey text-muted'>
            <i className='fas fa-user' />
          </div>
        )}
        <Link to={`/explorador/perfil/${explorer.id}`} className='fw-bold text-dark'>
          {explorer.name}
        </Link>
        <small className='text-muted'>
          {explorer.countChallengeCompleted === 1
            ? '1 desafio conquistado'
            : `${explorer.countChallengeCompleted} desafios conquistados`}
        </small>
        <small className='text-grey'>Explorador desde {moment(explorer.createdAt).format('DD/MM/YYYY')}</small>
        <span className='mt-auto mb-0'>{explorer.biography}</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, height: '50px', background: '#fbd499', zIndex: 1 }} />
    </div>
  );
};

export default CompactExplorerCard;
