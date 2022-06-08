import { Post } from '@sec/common';
import { CSSProperties, FunctionComponent, useState } from 'react';
import InstagramCard from '@Components/cards/InstagramCard';
import TwitterCard from '@Components/cards/TwitterCard';
import { SocialMediaName } from '@sec/common';
import ButtonRounded from '@Components/buttons/ButtonRounded';
import { PostStatus } from '@sec/common';
import SpinLoading from '@Components/loading/SpinLoading';

type ManagePostCardProps = {
  post: Post;
  onApprove: (id: number) => Promise<boolean>;
  onDisapprove: (id: number) => Promise<boolean>;
};

const ManagePostCard: FunctionComponent<ManagePostCardProps> = ({ post, onApprove, onDisapprove }) => {
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

  const [isSending, setIsSending] = useState<boolean | null>(false);

  const handleOnApprove = async () => {
    setIsSending(true);
    const result = await onApprove(post.id);

    if (result === false) setIsSending(null);
    else setIsSending(false);
  };
  const handleOnDisapprove = async () => {
    setIsSending(true);
    const result = await onDisapprove(post.id);

    if (result === false) setIsSending(null);
    else setIsSending(false);
  };

  return (
    <div
      className='post-min-width mx-auto mb-3'
      style={{ border: '1px solid #00000008', borderRadius: '15px', backgroundColor: '#00000008' }}
    >
      {components(post.url, post.token)[post.type]}
      <div
        className='d-flex flex-row justify-content-center gap-1 mb-1 position-relative'
        style={{ marginTop: post.type === SocialMediaName.INSTAGRAM ? '-.25rem' : '.25rem' }}
      >
        {isSending ? (
          <SpinLoading />
        ) : (
          <>
            <ButtonRounded
              variant={post.status === PostStatus.REFUSED || isSending === null ? 'secondary' : 'success'}
              onClick={handleOnApprove}
            >
              Aprovar
            </ButtonRounded>
            {isSending === null && (
              <i
                className='fas fa-exclamation-triangle text-danger my-auto'
                style={{ fontSize: '30px' }}
                title='Ocorreu um erro ao alterar o status dessa publicação'
              />
            )}
            <ButtonRounded
              variant={post.status === PostStatus.APPROVED || isSending === null ? 'secondary' : 'danger'}
              onClick={handleOnDisapprove}
            >
              Reprovar
            </ButtonRounded>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagePostCard;
