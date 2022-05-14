import { useContext, useEffect, useState } from 'react';
import PageCard from '@Components/cards/PageCard';
import { ToastContext } from '~/context/ToastContext';
import { Explorer } from '@sec/common';
import { defaultErrorHandler } from '~/error/defaultErrorHandler';
import SideCard from '@Components/cards/SideCard';
import PostsListCard from '@Components/cards/PostsListCard';
import CompactExplorerCard from '@Components/cards/CompactExplorerCard';
import Masonry from 'react-masonry-css';
import SpinLoading from '@Components/loading/SpinLoading';
import SearchInput from '@Components/Inputs/SearchInput';
import { matchSorter } from 'match-sorter';
import { getAvailableExplorers } from '@Services/explorerService';

const ExploreExplorers = () => {
  const { showToastDanger } = useContext(ToastContext);

  const [availableExplorers, setAvailableExplorers] = useState<Explorer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [explorersToShow, setExplorersToShow] = useState<Explorer[]>([]);
  const [listShowed, setListShowed] = useState<Explorer[]>([]);
  const [paginationTriggered, setPaginationTriggered] = useState(false);
  const [searchBox, setSearchBox] = useState('');

  useEffect(() => {
    fetchData();

    document.addEventListener('scroll', triggerPagination);
    return () => {
      document.removeEventListener('scroll', triggerPagination);
    };
  }, []);

  useEffect(() => {
    if (paginationTriggered) addExplorers(explorersToShow);
    setPaginationTriggered(false);
  }, [paginationTriggered]);

  useEffect(() => {
    setListShowed([]);
    addExplorers(matchSorter(availableExplorers, searchBox, { keys: ['nickname', 'name', 'email'] }));
  }, [availableExplorers, searchBox]);

  const triggerPagination = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      setPaginationTriggered(true);
    }
  };

  const addExplorers = (explorers: Explorer[], qtd = 12) => {
    const aux = [...explorers];
    const toAdd = aux.splice(0, qtd);

    setListShowed((current) => [...current, ...toAdd]);
    setExplorersToShow(aux);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const {
        payload: { explorers },
      } = await getAvailableExplorers(true);

      setAvailableExplorers(explorers);
    } catch (error) {
      defaultErrorHandler(error, showToastDanger);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='d-flex h-100'>
      <PageCard simpleVariant limitedWidth hidePaddingTopExtra>
        <div className='w-100 d-flex flex-row justify-content-between'>
          <h3>Buscar exploradores</h3>
          <SearchInput value={searchBox} onChange={(e) => setSearchBox(e.target.value)} />
        </div>
        <div className='row'>
          {isLoading && (
            <div className='col'>
              <SpinLoading />
            </div>
          )}
        </div>
        <div className='row'>
          <Masonry
            breakpointCols={{
              default: 4,
              1555: 3,
              1339: 2,
              1131: 1,
              991: 2,
              784: 1,
              767: 3,
              704: 2,
              500: 1,
            }}
            className='my-masonry-grid'
            columnClassName='my-masonry-grid_column'
          >
            {listShowed.map((explorer) => (
              <CompactExplorerCard key={`ExploreExplorers_CompactExplorerCard_${explorer.id}`} explorer={explorer} />
            ))}
          </Masonry>
        </div>
      </PageCard>
      <SideCard>
        <PostsListCard doubleSize />
      </SideCard>
    </div>
  );
};

export default ExploreExplorers;
