import PageCard from '@Components/cards/PageCard';
import { ModalMethods } from '@Components/modals/Modal';
import { GetAllSocialMediaPostsParams, Post, PostStatus } from '@sec/common';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import ModalFilter from './ModalFilter';
import { getAllSocialMediaPosts } from '@Services/socialMediaService';
import { ToastContext } from '~/context/ToastContext';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';

const managePosts: FunctionComponent = () => {
  const { showToastDanger, showToastWarning } = useContext(ToastContext);
  const modalFilter = useRef<ModalMethods>(null);

  const initialFilters: GetAllSocialMediaPostsParams = {
    status: [PostStatus.UNDER_REVIEW],
  };

  const [posts, setPosts] = useState<Post[]>([]);

  const [columnA, setColumnA] = useState<Post[]>([]);
  const [columnB, setColumnB] = useState<Post[]>([]);
  const [columnC, setColumnC] = useState<Post[]>([]);

  const [isLoading, setIsLoading] = useState(false);

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

      const columns: Post[][] = [[], [], []];
      posts.forEach((post, i) => columns[i % 3].push(post));
      setColumnA(columns[0]);
      setColumnB(columns[1]);
      setColumnC(columns[2]);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
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
            onClick: () => showToastWarning({ message: 'METHOD NOT IMPLEMENTED' }),
            label: 'Buscar nas redes sociais',
          },
        ]}
      >
        <div className='card-filter'>
          <button className='btn btn-secondary rounded-lg' onClick={() => modalFilter.current?.showModal()}>
            Filtrar
          </button>
        </div>
        <div className='row'>
          <div className='col'>{columnA.map(({ id }) => id).join(' - ')}</div>
          <div className='col'>{columnB.map(({ id }) => id).join(' - ')}</div>
          <div className='col'>{columnC.map(({ id }) => id).join(' - ')}</div>
        </div>
      </PageCard>
      {/* <ModalFilter modalRef={modalFilter} defaultValues={initialFilters} onSubmit={fetchData} /> */}
    </>
  );
};

export default managePosts;
