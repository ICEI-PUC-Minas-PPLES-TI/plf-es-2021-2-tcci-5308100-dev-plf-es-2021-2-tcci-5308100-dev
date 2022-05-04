import SocialMediaPostList from '@Components/lists/SocialMediaPostList';
import { Post } from '@sec/common';
import { UIEventHandler, useContext, useEffect, useState } from 'react';
import { SocialMediaPostContext } from '~/context/SocialMediaPostContext';

const PostsListCard = () => {
  const { posts } = useContext(SocialMediaPostContext);
  const [listShowed, setListShowed] = useState<Post[]>([]);
  const [postIndex, setPostIndex] = useState(0);

  useEffect(() => {
    addPosts(postIndex, 6);
  }, [posts]);

  const triggerPagination: UIEventHandler<HTMLDivElement> = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      addPosts(postIndex, 6);
    }
  };

  const addPosts = (start: number, qtd = 6) => {
    const aux = [...posts];
    const toAdd = aux.splice(start, qtd);

    setListShowed((current) => [...current, ...toAdd]);
    setPostIndex((curr) => curr + qtd);
  };

  return (
    <div
      className='card rounded-md social-media-widget'
      style={{ minHeight: '40vh', maxHeight: '80vh', overflowX: 'hidden', overflowY: 'scroll' }}
      onScroll={triggerPagination}
    >
      <SocialMediaPostList posts={listShowed} />
    </div>
  );
};

export default PostsListCard;
