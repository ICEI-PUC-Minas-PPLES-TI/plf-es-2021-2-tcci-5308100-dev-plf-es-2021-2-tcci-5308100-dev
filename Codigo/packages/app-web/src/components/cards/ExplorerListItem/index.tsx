import { Explorer } from '@sec/common';
import { generateBackgroundById, generateRandom } from '@Utils/util';
import { FunctionComponent } from 'react';

type ExplorerListItemProps = { explorer: Explorer };

const ExplorerListItem: FunctionComponent<ExplorerListItemProps> = ({ explorer }) => {
  const color = generateBackgroundById(explorer.id);

  return (
    <div className='d-flex flex-column'>
      <div className='d-flex align-items-center'>
        {explorer.avatar ? (
          <img className='rounded-circle avatar-size-sm' src={explorer.avatar.urlPath} />
        ) : (
          <div
            className={`rounded-circle overflow-hidden flex-center align-items-start avatar-size-sm text-muted border border-${color} border-grey bg-white`}
          >
            <i className={`fas fa-user text-bg-color bg-${color}`} />
          </div>
        )}
        <span className='text-muted ms-1' style={{ fontSize: '1rem' }}>
          {explorer.name}
        </span>
      </div>
      <small style={{ fontSize: '0.8rem', color: 'var(--bs-gray)' }}>{explorer.favoriteProduct}</small>
      <span style={{ fontSize: '0.9rem', color: 'var(--bs-gray-800)' }}>{explorer.biography}</span>
    </div>
  );
};

export default ExplorerListItem;
