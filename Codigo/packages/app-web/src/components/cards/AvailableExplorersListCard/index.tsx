import { Explorer } from '@sec/common';
import { UIEventHandler, useContext, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { SocialMediaPostContext } from '~/context/SocialMediaPostContext';
import ExplorerListItem from '../ExplorerListItem';

const AvailableExplorersListCard = () => {
  const { availableExplorers } = useContext(SocialMediaPostContext);
  const location = useLocation();

  const [explorersToShow, setExplorersToShow] = useState<Explorer[]>([]);
  const [listShowed, setListShowed] = useState<Explorer[]>([]);

  useEffect(() => {
    setListShowed([]);
    addExplorers(availableExplorers, 6);
  }, [availableExplorers]);

  const triggerPagination: UIEventHandler<HTMLDivElement> = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      addExplorers(explorersToShow, 6);
    }
  };

  const addExplorers = (explorers: Explorer[], qtd = 6) => {
    const aux = [...explorers];
    const toAdd = aux.splice(0, qtd);

    setListShowed((current) => [...current, ...toAdd]);
    setExplorersToShow(aux);
  };

  return (
    <div
      className='card rounded-md overflow-hidden-overlay custom-scrollbar-light'
      style={{ height: '40vh' }}
      onScroll={triggerPagination}
    >
      <ListGroup>
        {listShowed.map((explorer) => (
          <ListGroup.Item
            key={`${location.pathname}_AvailableExplorersListCard_${explorer.id}`}
            action
            href={`/explorador/perfil/${explorer.id}`}
            active={false}
          >
            <ExplorerListItem explorer={explorer} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default AvailableExplorersListCard;
