import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Explorer, Post, SocialMediaName } from '@sec/common';
import { useLocation } from 'react-router-dom';
import { shuffleArray } from '@Utils/util';
import { getAvailablePosts } from '@Services/socialMediaService';
import { getAvailableExplorers } from '@Services/explorerService';

interface SocialMediaPostContextState {
  posts: Post[];
  availableExplorers: Explorer[];
}

const SocialMediaPostContext = createContext<SocialMediaPostContextState>({} as SocialMediaPostContextState);

const SocialMediaPostProvider: React.FunctionComponent = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    fetchPosts();
    fetchAvailableExplorers();
  }, [location.pathname]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [availableExplorers, setAvailableExplorers] = useState<Explorer[]>([]);

  const fetchPosts = async () => {
    try {
      // const {
      //   payload: { posts },
      // } = await getAvailablePosts();

      // setPosts(shuffleArray(posts));
      setPosts(
        shuffleArray([
          { id: 1, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 2, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 3, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 4, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 5, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 6, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 7, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 8, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 9, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 10, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 11, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 12, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 13, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 14, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 15, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 16, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
          { id: 17, token: '1083592734038929408', type: SocialMediaName.TWITTER } as any,
          { id: 18, token: 'https://www.instagram.com/p/Cc15QqJuf8Q', type: SocialMediaName.INSTAGRAM } as any,
        ])
      );

      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchAvailableExplorers = async () => {
    try {
      // const {
      //   payload: { explorers },
      // } = await getAvailableExplorers();

      // setAvailableExplorers(shuffleArray(explorers));
      setAvailableExplorers(shuffleArray([]));

      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <SocialMediaPostContext.Provider value={{ posts, availableExplorers }}>{children}</SocialMediaPostContext.Provider>
  );
};

export { SocialMediaPostContext, SocialMediaPostProvider };
