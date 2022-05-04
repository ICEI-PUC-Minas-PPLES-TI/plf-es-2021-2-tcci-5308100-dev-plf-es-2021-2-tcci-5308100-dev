import { FunctionComponent } from 'react';
import { TwitterEmbed } from 'react-social-media-embed';
import { TwitterTweetEmbed } from 'react-twitter-embed';

type TwitterCardProps = { tweetId: string };

const TwitterCard: FunctionComponent<TwitterCardProps> = ({ tweetId }) => {
  return (
    <div className='social-media-widget social-media-widget'>
      <TwitterEmbed url='' twitterTweetEmbedProps={{ tweetId: tweetId }} width={328} />
    </div>
  );
};

export default TwitterCard;
