import { Challenge, ChallengeAccepted } from '@sec/common';
import { challengeAcceptedStatusFttr } from '@Utils/formatters';
import moment from 'moment';
import React from 'react';

type ChallengeCardProps = {
  challenge: Challenge;
  challengeAccepted?: ChallengeAccepted;
  onClick?: () => void;
};

const ChallengeCard: React.FunctionComponent<ChallengeCardProps> = ({ challenge, challengeAccepted, onClick }) => {
  return (
    <div
      className={`${onClick ? 'clickable' : ''} card rounded-md h-100`}
      style={{ background: '#f5f5f5' }}
      onClick={onClick}
    >
      <img
        className='w-100 rounded-md rounded-bottom-none'
        style={{ maxHeight: '200px', objectFit: 'cover' }}
        src={challenge.cover.urlPath}
      />

      <div className='card-body'>
        <div className='row'>
          <div className='col-6 d-flex flex-column text-grey'>
            <h4>{challenge.title}</h4>
            {challengeAccepted && (
              <span style={{ fontSize: '0.9rem' }}>
                Participado em {moment(challengeAccepted.createdAt).format('DD/MM/YYYY')}
              </span>
            )}
            <span style={{ fontSize: '0.9rem' }}>{challenge.recompense.name}</span>
          </div>
          <div className='col-6 d-flex justify-content-end align-items-end flex-column'>
            {challengeAccepted && (
              <span
                className='flex-center py-1 bg-secondary rounded-md rounded-lg text-white fw-bold'
                style={{ width: '145px' }}
              >
                {challengeAcceptedStatusFttr(challengeAccepted.status)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
