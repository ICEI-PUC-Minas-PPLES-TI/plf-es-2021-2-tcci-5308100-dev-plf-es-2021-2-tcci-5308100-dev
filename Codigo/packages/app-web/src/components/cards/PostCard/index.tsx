import { Post } from '@sec/common';
import { FunctionComponent } from 'react';
import InstagramCard from '@Components/cards/InstagramCard';
import TwitterCard from '@Components/cards/TwitterCard';
import { SocialMediaName } from '@sec/common';

type PostCardProps = {
  post: Post;
};

const PostCard: FunctionComponent<PostCardProps> = ({ post }) => {
  const components: (postToken: string, postId: string) => { [key in SocialMediaName]: JSX.Element } = (
    postToken,
    postId
  ) => ({
    INSTAGRAM: <InstagramCard instagramURL={postToken} />,
    TIKTOK: <></>,
    TWITTER: <TwitterCard tweetURL={postToken} tweetId={postId} />,
    FACEBOOK: <></>,
    LINKEDIN: <></>,
  });

  return <div className='post-min-width mx-auto mb-3'>{components(post.url, post.token)[post.type]}</div>;
};

export default PostCard;
