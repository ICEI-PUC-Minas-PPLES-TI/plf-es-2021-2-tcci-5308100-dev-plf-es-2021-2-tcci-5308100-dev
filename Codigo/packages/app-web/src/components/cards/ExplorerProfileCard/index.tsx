import React, { useContext } from 'react';
import { Explorer } from '@sec/common';
import moment from 'moment';
import { CSSProperties } from 'react';
import Skeleton from 'react-loading-skeleton';
import DropdownBackless from '@Components/dropdown/DropdownBackless';
import { AuthContext } from '~/context/AuthContext';
// import {AuthContext} from '~/context/AuthContext'

export type ExplorerProfileCardProps = {
  explorer: Explorer | undefined;
  onEdit?: (explorer: Explorer) => void;
};

const ExplorerProfileCard: React.FunctionComponent<ExplorerProfileCardProps> = ({ explorer, onEdit }) => {
  const classSideDiv = 'flex-grow-1 flex-center flex-column justify-content-end pb-3';
  const styleSideDiv: CSSProperties = { width: 'calc(50% - 100px)', fontSize: '0.9rem' };

  const { user } = useContext(AuthContext);

  const profileUrls = {
    instagram: (socialMediaProfile: string) => `https://www.instagram.com/${socialMediaProfile}`,
    tikTok: (socialMediaProfile: string) => `https://www.tiktok.com/${socialMediaProfile}`,
    twitter: (socialMediaProfile: string) => `https://twitter.com/${socialMediaProfile}`,
    facebook: (socialMediaProfile: string) => `https://www.facebook.com/${socialMediaProfile}`,
    linkedIn: (socialMediaProfile: string) => `https://www.linkedin.com/in/${socialMediaProfile}`,
  };

  const formatExplorerSocialMedia = (
    profile: 'instagram' | 'tikTok' | 'twitter' | 'facebook' | 'linkedIn',
    iconClass: string
  ) => {
    const socialMediaProfile = explorer ? explorer[profile] : null;
    if (socialMediaProfile) {
      return (
        <a
          className='text-decoration-none'
          href={profileUrls[profile](socialMediaProfile)}
          target='_blank'
          rel='noreferrer'
        >
          {profile} <i className={iconClass} style={{ width: '15px' }} />
        </a>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className='card rounded-md mb-5 flex-row overflow-hidden' style={{ height: '250px', background: '#80808014' }}>
      <div className={`${classSideDiv} align-items-start ps-3`} style={styleSideDiv}>
        {explorer && (
          <>
            <span className='d-md-none d-lg-block'>
              Apelido: <b>{explorer.nickname}</b>
            </span>
            <span className='d-md-none d-lg-block'>
              Explorador desde <b>{moment(explorer.createdAt).format('DD/MM/YYYY')}</b>
            </span>
            <span className='d-md-none d-lg-block'>
              {explorer.countChallengeCompleted === 1
                ? '1 desafio conquistado'
                : `${explorer.countChallengeCompleted} desafios conquistados`}
            </span>
            <span className='d-md-none d-lg-block'>Produto preferido: {explorer.favoriteProduct}</span>
            <span className='d-md-none d-lg-block mt-2'>Bio.: {explorer.biography}</span>
          </>
        )}
      </div>
      <div className='flex-center justify-content-between flex-column h-100 py-3' style={{ width: '200px', zIndex: 2 }}>
        {!explorer ? (
          <Skeleton circle width='160px' height='160px' />
        ) : explorer.avatar ? (
          <img className='rounded-circle avatar-size' src={explorer.avatar.urlPath} />
        ) : (
          <div
            className='rounded-circle overflow-hidden flex-center align-items-start avatar-size border-grey text-muted'
            style={{ fontSize: '160px' }}
          >
            <i className='fas fa-user' />
          </div>
        )}
        {explorer && <h5 className='text-center m-0'>Bianca Julia Regina Beatriz Gomes</h5>}
      </div>
      <div className={`${classSideDiv} align-items-end pe-3`} style={styleSideDiv}>
        {explorer && (
          <>
            {formatExplorerSocialMedia('instagram', 'fab fa-instagram')}
            {formatExplorerSocialMedia('tikTok', 'fab fa-tiktok')}
            {formatExplorerSocialMedia('twitter', 'fab fa-twitter')}
            {formatExplorerSocialMedia('facebook', 'fab fa-facebook')}
            {formatExplorerSocialMedia('linkedIn', 'fab fa-linkedin')}
          </>
        )}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, height: '40%', background: '#fbd499', zIndex: 1 }} />
      {explorer && user.id === explorer.id && (
        <div className='' style={{ position: 'absolute', top: 0, right: '6px', zIndex: 3 }}>
          <DropdownBackless
            noCaret
            noShadow
            label='bars'
            menus={[
              {
                iconClass: 'far fa-edit',
                title: 'Editar',
                subtitle: 'Editar meu perfil',
                onClick: () => explorer && onEdit && onEdit(explorer),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default ExplorerProfileCard;
