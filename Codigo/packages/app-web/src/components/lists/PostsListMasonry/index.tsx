import ManagePostCard from '@Components/cards/ManagePostCard';
import { Post } from '@sec/common';
import { FunctionComponent } from 'react';
import Masonry from 'react-masonry-css';

const PostsListMasonry: FunctionComponent = ({ children }) => {
  return (
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
      {children}
    </Masonry>
  );
};

export default PostsListMasonry;
