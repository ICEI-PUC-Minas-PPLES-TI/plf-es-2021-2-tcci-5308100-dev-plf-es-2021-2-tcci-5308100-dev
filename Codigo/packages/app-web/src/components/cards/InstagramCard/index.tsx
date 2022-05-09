import ErrorCatcher from '@Components/error/ErrorCatcher';
import { FunctionComponent } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
// import InstagramEmbed from 'react-instagram-embed';

type InstagramCardProps = {
  instagramURL: string;
};

const InstagramCard: FunctionComponent<InstagramCardProps> = ({ instagramURL }) => {
  return (
    <div className='position-relative'>
      <ErrorCatcher>
        <InstagramEmbed url={instagramURL} width={330} />
      </ErrorCatcher>
    </div>
  );
};

export default InstagramCard;
