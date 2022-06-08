import PageCard from '@Components/cards/PageCard';
import { ModalMethods } from '@Components/modals/Modal';
import { GetAllSocialMediaPostsParams, Post, PostStatus } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter from './ModalFilter';
import { getAllSocialMediaPosts, searchPublications, updatePostState } from '@Services/socialMediaService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import ManagePostCard from '@Components/cards/ManagePostCard';
import SpinLoading from '@Components/loading/SpinLoading';
import { Alert } from 'react-bootstrap';
import Masonry from 'react-masonry-css';

const ManagePosts: FunctionComponent = () => {
  const { showToastDanger, showToastSuccess } = useContext(ToastContext);
  const modalFilter = useRef<ModalMethods>(null);

  const initialFilters: GetAllSocialMediaPostsParams = {
    status: [],
  };

  const [posts, setPosts] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingPosts, setIsSearchingPosts] = useState(false);

  useEffect(() => {
    fetchData(initialFilters);
  }, []);

  const fetchData = async (filter?: GetAllSocialMediaPostsParams) => {
    try {
      setIsLoading(true);
      const {
        payload: { posts },
      } = await getAllSocialMediaPosts(filter);

      setPosts(posts);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchPublications = async () => {
    try {
      setIsSearchingPosts(true);
      const { message } = await searchPublications();

      setPosts(posts);
      showToastSuccess({ message });
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsSearchingPosts(false);
    }
  };

  const onApprovePost = async (id: number) => {
    return onUpdatePostStatus({ id, status: PostStatus.APPROVED });
  };

  const onDisapprovePost = async (id: number) => {
    return onUpdatePostStatus({ id, status: PostStatus.REFUSED });
  };

  const onUpdatePostStatus = async ({ id, status }: { id: number; status: PostStatus }) => {
    try {
      const {
        payload: { post },
      } = await updatePostState({ id, status });

      setPosts((posts) => {
        const currentPostIndex = posts.findIndex((p) => p.id === post.id);

        if (currentPostIndex !== -1) {
          const postsAux = [...posts];
          postsAux.splice(currentPostIndex, 1, post);
          return postsAux;
        } else {
          return posts;
        }
      });
      return true;
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
      return false;
    }
  };

  return (
    <>
      <PageCard
        showBackButton
        backButtonURL='/administrador/redes-sociais'
        title='Gerenciar parâmetros de redes sociais'
        actions={[
          {
            type: 'BUTTON',
            variant: 'success',
            onClick: handleSearchPublications,
            label: (
              <span className='d-flex flex-row'>
                Buscar nas redes sociais &nbsp; {isSearchingPosts && <SpinLoading noSize size={20} />}
              </span>
            ),
          },
        ]}
      >
        <div className='card-filter'>
          <button className='btn btn-secondary rounded-lg' onClick={() => modalFilter.current?.showModal()}>
            Filtrar
          </button>
        </div>
        <div className='row'>
          {isLoading && (
            <div className='col'>
              <SpinLoading />
            </div>
          )}
          {posts.length === 0 && (
            <div className='col-12'>
              <Alert variant={'secondary'}>Tente alterar os filtros para recuperar outras publicações</Alert>
            </div>
          )}
        </div>
        <div className='row'>
          <Masonry
            breakpointCols={{
              default: 4,
              1700: 3,
              1359: 2,
              1040: 1,
              768: 2,
              740: 1,
            }}
            className='my-masonry-grid'
            columnClassName='my-masonry-grid_column'
          >
            {posts.map((post) => (
              <ManagePostCard
                key={`ManagePosts_ManagePostCard_${post.id}`}
                post={post}
                onApprove={onApprovePost}
                onDisapprove={onDisapprovePost}
              />
            ))}
          </Masonry>
        </div>
      </PageCard>
      <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} />
    </>
  );
};

export default ManagePosts;
