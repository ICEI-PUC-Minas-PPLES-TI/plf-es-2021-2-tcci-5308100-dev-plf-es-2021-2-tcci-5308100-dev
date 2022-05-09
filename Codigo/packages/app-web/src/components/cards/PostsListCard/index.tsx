import SocialMediaPostList from '@Components/lists/SocialMediaPostList';
import { Post } from '@sec/common';
import { FunctionComponent, UIEventHandler, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SocialMediaPostContext } from '~/context/SocialMediaPostContext';

type PostsListCardProps = {
  doubleSize?: boolean;
};

const PostsListCard: FunctionComponent<PostsListCardProps> = ({ doubleSize }) => {
  const { posts } = useContext(SocialMediaPostContext);
  const location = useLocation();

  const [postsToShow, setPostsToShow] = useState<Post[]>([]);
  const [listShowed, setListShowed] = useState<Post[]>([]);

  useEffect(() => {
    setListShowed([]);
    addPosts(posts, 6);
  }, [posts]);

  const triggerPagination: UIEventHandler<HTMLDivElement> = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      addPosts(postsToShow, 6);
    }
  };

  const addPosts = (posts: Post[], qtd = 6) => {
    const aux = [...posts];
    const toAdd = aux.splice(0, qtd);

    setListShowed((current) => [...current, ...toAdd]);
    setPostsToShow(aux);
  };

  return (
    <div
      className='card rounded-md overflow-hidden-overlay custom-scrollbar-light'
      style={{
        minHeight: doubleSize ? '83.5vh' : '40vh',
        maxHeight: doubleSize ? '83.5vh' : '80vh',
        overflowX: 'hidden',
        overflowY: 'scroll',
      }}
      onScroll={triggerPagination}
    >
      <SocialMediaPostList keyPrefix={location.pathname} posts={listShowed} />
    </div>
  );
};

export default PostsListCard;
