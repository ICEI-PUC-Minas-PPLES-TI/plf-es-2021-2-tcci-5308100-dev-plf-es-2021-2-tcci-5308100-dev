import { Fragment, FunctionComponent, useEffect, useRef } from 'react';
import TwitterCard from '@Components/cards/TwitterCard';
import { Post, SocialMediaName } from '@sec/common';
import InstagramCard from '@Components/cards/InstagramCard';

type SocialMediaPostListProps = {
  posts: Post[];
  keyPrefix?: string;
};

const SocialMediaPostList: FunctionComponent<SocialMediaPostListProps> = ({ posts, keyPrefix }) => {
  const components: (key: string, postToken: string, postId: string) => { [key in SocialMediaName]: JSX.Element } = (
    key,
    postToken,
    postId
  ) => ({
    INSTAGRAM: <InstagramCard key={key} instagramURL={postToken} />,
    TIKTOK: <></>,
    TWITTER: <TwitterCard key={key} tweetURL={postToken} tweetId={postId} />,
    FACEBOOK: <></>,
    LINKEDIN: <></>,
  });

  return (
    <>
      {posts.map(
        (post) => components(`${keyPrefix}_SocialMediaPostListProps_${post.id}`, post.url, post.token)[post.type]
      )}
    </>
  );
};

export default SocialMediaPostList;
