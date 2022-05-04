import { FunctionComponent } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
// import InstagramEmbed from 'react-instagram-embed';

type InstagramCardProps = {
  instagramId: string;
};

const InstagramCard: FunctionComponent<InstagramCardProps> = ({ instagramId }) => {
  return (
    <div className='social-media-widget social-media-widget'>
      <InstagramEmbed url='https://www.instagram.com/p/CUbHfhpswxt/' width={330} />
    </div>
  );
};

export default InstagramCard;
