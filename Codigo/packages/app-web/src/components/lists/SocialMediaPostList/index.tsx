import { Fragment, FunctionComponent, useEffect, useRef } from 'react';
import TwitterCard from '@Components/cards/TwitterCard';
import { Post, SocialMediaName } from '@sec/common';
import InstagramCard from '@Components/cards/InstagramCard';

type SocialMediaPostListProps = {
  posts: Post[];
};

const SocialMediaPostList: FunctionComponent<SocialMediaPostListProps> = ({ posts }) => {
  const components: (postToken: string) => { [key in SocialMediaName]: JSX.Element } = (postToken) => ({
    INSTAGRAM: <InstagramCard instagramId={postToken} />,
    TIKTOK: <></>,
    TWITTER: <TwitterCard tweetId={postToken} />,
    FACEBOOK: <></>,
    LINKEDIN: <></>,
  });

  return (
    <>
      {posts.map((post) => (
        <Fragment key={`SocialMediaPostListProps_${post.id}`}>{components(post.token)[post.type]}</Fragment>
      ))}
    </>
  );
};

export default SocialMediaPostList;
