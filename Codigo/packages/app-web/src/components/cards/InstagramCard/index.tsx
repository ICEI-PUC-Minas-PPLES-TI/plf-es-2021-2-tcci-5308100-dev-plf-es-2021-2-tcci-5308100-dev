import { FunctionComponent } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
// import InstagramEmbed from 'react-instagram-embed';

type InstagramCardProps = {
  instagramURL: string;
};

const InstagramCard: FunctionComponent<InstagramCardProps> = ({ instagramURL }) => {
  return (
    <div className='position-relative'>
      <InstagramEmbed url={instagramURL} width={330} />
    </div>
  );
};

export default InstagramCard;
