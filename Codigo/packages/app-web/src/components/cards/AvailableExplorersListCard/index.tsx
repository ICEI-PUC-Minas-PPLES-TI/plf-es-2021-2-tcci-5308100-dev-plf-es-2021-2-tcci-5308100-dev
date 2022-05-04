import SocialMediaPostList from '@Components/lists/SocialMediaPostList';
import { Post } from '@sec/common';
import { UIEventHandler, useContext, useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { SocialMediaPostContext } from '~/context/SocialMediaPostContext';

const AvailableExplorersListCard = () => {
  // const { posts } = useContext(SocialMediaPostContext);
  // const [listShowed, setListShowed] = useState<Post[]>([]);
  // const [postIndex, setPostIndex] = useState(0);

  // useEffect(() => {
  //   addPosts(postIndex, 6);
  // }, [posts]);

  const triggerPagination: UIEventHandler<HTMLDivElement> = (event) => {
    //   const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    //   if (scrollTop + clientHeight >= scrollHeight * 0.9) {
    //     addPosts(postIndex, 6);
    //   }
  };

  // const addPosts = (start: number, qtd = 6) => {
  //   const aux = [...posts];
  //   const toAdd = aux.splice(start, qtd);

  //   setListShowed((current) => [...current, ...toAdd]);
  //   setPostIndex((curr) => curr + qtd);
  // };

  return (
    <div
      className='card rounded-md social-media-widget'
      style={{ height: '40vh', overflowX: 'hidden', overflowY: 'scroll' }}
      onScroll={triggerPagination}
    >
      <ListGroup>
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Morbi leo risus</ListGroup.Item>
        <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default AvailableExplorersListCard;
