import { Post } from '@sec/common';
import { FunctionComponent } from 'react';

type SocialMediaStoriesCardProps = { socialMediaStory: Post };

const SocialMediaStoriesCard: FunctionComponent<SocialMediaStoriesCardProps> = ({ socialMediaStory }) => {
  return (
    <div
      className='card rounded-md mx-2 overflow-hidden'
      style={{ height: '200px', minHeight: '200px', width: '125px', minWidth: '125px' }}
    >
      <img
        className='object-fit-cover'
        style={{ minWidth: '100%', minHeight: '100%' }}
        src={`https://source.unsplash.com/20${socialMediaStory.id}x12${socialMediaStory.id + 5}/?business-woman`}
        // src={`https://random.imagecdn.app/20${socialMediaStory.id}/12${socialMediaStory.id + 5}`}
      />
      <span className='w-100 h-100 d-flex justify-content-center align-items-center d-none'>
        social
        <br />
        media
        <br />
        story
      </span>
    </div>
  );
};

export default SocialMediaStoriesCard;
