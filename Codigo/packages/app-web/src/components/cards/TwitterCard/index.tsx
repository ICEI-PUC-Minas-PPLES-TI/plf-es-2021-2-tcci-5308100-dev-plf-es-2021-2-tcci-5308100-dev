import ErrorCatcher from '@Components/error/ErrorCatcher';
import { FunctionComponent } from 'react';
import { TwitterEmbed } from 'react-social-media-embed';

type TwitterCardProps = {
  tweetId: string;
  tweetURL: string;
};

const TwitterCard: FunctionComponent<TwitterCardProps> = ({ tweetId, tweetURL }) => {
  return (
    <div className='position-relative'>
      <ErrorCatcher>
        <TwitterEmbed twitterTweetEmbedProps={{ tweetId: tweetId }} url={tweetURL || ''} width={330} />
      </ErrorCatcher>
    </div>
  );
};

export default TwitterCard;
