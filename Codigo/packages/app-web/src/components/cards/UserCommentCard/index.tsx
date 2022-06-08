import { Comment, UserType } from '@sec/common';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

type UserCommentCardProps = {
  comment: Comment;
};
const UserCommentCard: FunctionComponent<UserCommentCardProps> = ({ comment }) => {
  return (
    <div>
      <div className='d-flex align-items-center'>
        <div
          className='rounded-circle overflow-hidden flex-center align-items-start border-grey text-muted me-2'
          style={{ width: '40px', height: '40px', fontSize: '40px' }}
        >
          {/* <img src={} /> */}
          {comment.user.profile.type === UserType.EXPLORER ? (
            <i className='fas fa-user' />
          ) : (
            <i className='fas fa-user-tie' />
          )}
        </div>
        <span className='m-0 me-2 fw-bold' style={{ fontSize: '1.1rem' }}>
          {comment.user.nickname}
        </span>
        <small className='text-muted'>{moment(comment.createdAt).format('DD/MM/YYYY [as] HH:mm')}</small>
      </div>
      <p style={{ marginLeft: '49px' }}>{comment.text}</p>
    </div>
  );
};

export default UserCommentCard;
