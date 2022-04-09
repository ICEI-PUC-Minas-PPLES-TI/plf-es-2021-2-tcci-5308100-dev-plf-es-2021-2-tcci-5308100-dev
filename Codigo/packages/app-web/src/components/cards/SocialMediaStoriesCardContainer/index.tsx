import { Post } from '@sec/common';
import React, { FunctionComponent } from 'react';
import SocialMediaStoriesCard from '../SocialMediaStoriesCard';

type SocialMediaStoriesCardContainerProps = { socialMediaStories: Post[] };

const SocialMediaStoriesCardContainer: FunctionComponent<SocialMediaStoriesCardContainerProps> = ({
  socialMediaStories,
}) => {
  return (
    <div className='mb-3 d-flex' style={{ height: '200px' }}>
      <div className='w-100 h-100 position-relative'>
        <i className='position-absolute fas fa-angle-left' style={{ left: 0, top: '50%' }} />
        <i className='position-absolute fas fa-angle-right' style={{ right: 0, top: '50%' }} />
        <div className='mx-3 h-100 d-flex overflow-hidden'>
          {socialMediaStories.map((socialMediaStory) => (
            <SocialMediaStoriesCard
              key={`SocialMediaStoriesCardContainer_SocialMediaStoriesCard_${socialMediaStory.id}`}
              socialMediaStory={socialMediaStory}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaStoriesCardContainer;
