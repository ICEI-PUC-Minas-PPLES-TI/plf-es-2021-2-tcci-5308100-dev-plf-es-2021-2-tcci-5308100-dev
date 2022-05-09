import { useContext, useEffect, useState } from 'react';
import PageCard from '@Components/cards/PageCard';
import { Post } from '@sec/common';
import SideCard from '@Components/cards/SideCard';
import AvailableExplorersListCard from '@Components/cards/AvailableExplorersListCard';
import SpinLoading from '@Components/loading/SpinLoading';
import { Alert } from 'react-bootstrap';
import Masonry from 'react-masonry-css';
import PostCard from '@Components/cards/PostCard';
import { SocialMediaPostContext } from '~/context/SocialMediaPostContext';

const ExplorePublications = () => {
  const { posts, isLoadingPosts } = useContext(SocialMediaPostContext);

  const [postsToShow, setPostsToShow] = useState<Post[]>([]);
  const [listShowed, setListShowed] = useState<Post[]>([]);
  const [paginationTriggered, setPaginationTriggered] = useState(false);

  useEffect(() => {
    document.addEventListener('scroll', triggerPagination);
    return () => {
      document.removeEventListener('scroll', triggerPagination);
    };
  }, []);

  useEffect(() => {
    if (paginationTriggered) addPosts(postsToShow);
    setPaginationTriggered(false);
  }, [paginationTriggered]);

  useEffect(() => {
    setListShowed([]);
    addPosts(posts);
  }, [posts]);

  const triggerPagination = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      setPaginationTriggered(true);
    }
  };

  const addPosts = (posts: Post[], qtd = 6) => {
    const aux = [...posts];
    const toAdd = aux.splice(0, qtd);

    setListShowed((current) => [...current, ...toAdd]);
    setPostsToShow(aux);
  };

  return (
    <div className='d-flex h-100'>
      <PageCard simpleVariant limitedWidth hidePaddingTopExtra>
        <div className='row'>
          {isLoadingPosts && (
            <div className='col'>
              <SpinLoading />
            </div>
          )}
          {listShowed.length === 0 && (
            <div className='col-12'>
              <Alert variant={'secondary'}>
                Ainda não encontramos nenhuma publicação, mas estamos trabalhando para isso :)
              </Alert>
            </div>
          )}
        </div>
        <div className='row'>
          <Masonry
            breakpointCols={{
              default: 2,
              1385: 1,
              768: 2,
              740: 1,
            }}
            className='my-masonry-grid'
            columnClassName='my-masonry-grid_column'
          >
            {listShowed.map((post) => (
              <PostCard key={`ExplorePublications_PostCard_${post.id}`} post={post} />
            ))}
          </Masonry>
        </div>
      </PageCard>
      <SideCard>
        <AvailableExplorersListCard doubleSize />
      </SideCard>
    </div>
  );
};

export default ExplorePublications;
