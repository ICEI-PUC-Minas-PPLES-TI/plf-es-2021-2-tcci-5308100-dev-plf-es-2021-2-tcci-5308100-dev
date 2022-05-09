import { Explorer } from '@sec/common';
import { FunctionComponent, UIEventHandler, useContext, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { SocialMediaPostContext } from '~/context/SocialMediaPostContext';
import ExplorerListItem from '../ExplorerListItem';

type AvailableExplorersListCardProps = {
  doubleSize?: boolean;
};

const AvailableExplorersListCard: FunctionComponent<AvailableExplorersListCardProps> = ({ doubleSize }) => {
  const { availableExplorers } = useContext(SocialMediaPostContext);
  const location = useLocation();

  const [explorersToShow, setExplorersToShow] = useState<Explorer[]>([]);
  const [listShowed, setListShowed] = useState<Explorer[]>([]);

  useEffect(() => {
    setListShowed([]);
    addExplorers(availableExplorers);
  }, [availableExplorers]);

  const triggerPagination: UIEventHandler<HTMLDivElement> = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight * 0.9) {
      addExplorers(explorersToShow);
    }
  };

  const addExplorers = (explorers: Explorer[], qtd = doubleSize ? 12 : 6) => {
    const aux = [...explorers];
    const toAdd = aux.splice(0, qtd);

    setListShowed((current) => [...current, ...toAdd]);
    setExplorersToShow(aux);
  };

  return (
    <div
      className='card rounded-md overflow-hidden-overlay custom-scrollbar-light'
      style={{ height: doubleSize ? '83.5vh' : '40vh' }}
      onScroll={triggerPagination}
    >
      <ListGroup>
        {listShowed.map((explorer) => (
          <ListGroup.Item
            as={Link}
            key={`${location.pathname}_AvailableExplorersListCard_${explorer.id}`}
            action
            to={`/explorador/perfil/${explorer.id}`}
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
