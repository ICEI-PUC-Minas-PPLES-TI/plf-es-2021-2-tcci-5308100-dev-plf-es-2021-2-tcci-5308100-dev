import { ChallengeAccepted } from '@sec/common';
import { challengeAcceptedStatusFttr } from '@Utils/formatters';
import moment from 'moment';
import React from 'react';

type ChallengeAcceptedCardProps = {
  challengeAccepted: ChallengeAccepted;
  onClick?: () => void;
};

export const ChallengeAcceptedCard: React.FunctionComponent<ChallengeAcceptedCardProps> = ({
  challengeAccepted,
  onClick,
}) => {
  return (
    <div
      className={`${onClick ? 'clickable' : ''} card rounded-md h-100`}
      style={{ background: '#f5f5f5' }}
      onClick={onClick}
    >
      <img
        className='w-100 rounded-md border-bottom-none'
        style={{ maxHeight: '200px', objectFit: 'cover' }}
        src={
          // FIXME: Alterar quando for definido o sistema para upload de arquivos
          challengeAccepted.challenge.cover?.urlPath ||
          'https://viagemeturismo.abril.com.br/wp-content/uploads/2020/10/gettyimages-1187018564.jpg?quality=70&strip=info'
        }
      />

      <div className='card-body'>
        <div className='row'>
          <div className='col-6 d-flex flex-column text-grey'>
            <h4>{challengeAccepted.challenge.title}</h4>
            <span style={{ fontSize: '0.9rem' }}>
              Participado em {moment(challengeAccepted.updatedAt).format('DD/MM/YYYY')}
            </span>
            <span style={{ fontSize: '0.9rem' }}>{challengeAccepted.challenge.recompense.name}</span>
          </div>
          <div className='col-6 d-flex justify-content-end align-items-end flex-column'>
            <span
              className='flex-center py-1 bg-secondary rounded-md rounded-lg text-white fw-bold'
              style={{ width: '125px' }}
            >
              {challengeAcceptedStatusFttr(challengeAccepted.status)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
