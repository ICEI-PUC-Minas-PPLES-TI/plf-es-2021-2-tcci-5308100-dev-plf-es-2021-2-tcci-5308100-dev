import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Explorer, Post, SocialMediaName } from '@sec/common';
import { useLocation } from 'react-router-dom';
import { shuffleArray } from '@Utils/util';
import { getAvailablePosts } from '@Services/socialMediaService';
import { getAvailableExplorers } from '@Services/explorerService';
import { AuthContext } from './AuthContext';

interface SocialMediaPostContextState {
  posts: Post[];
  availableExplorers: Explorer[];
}

const SocialMediaPostContext = createContext<SocialMediaPostContextState>({} as SocialMediaPostContextState);

//TODO: Adicionar scroll infinito
const SocialMediaPostProvider: React.FunctionComponent = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    if (
      isAuthenticated() &&
      ['/explorador/', '/explorador/perfil', '/explorador/indicar'].includes(location.pathname)
    ) {
      fetchPosts();
      fetchAvailableExplorers();
    }
  }, [location.pathname]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [availableExplorers, setAvailableExplorers] = useState<Explorer[]>([]);

  const fetchPosts = async () => {
    try {
      const {
        payload: { posts },
      } = await getAvailablePosts();

      setPosts(shuffleArray(posts));

      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchAvailableExplorers = async () => {
    try {
      const {
        payload: { explorers },
      } = await getAvailableExplorers();

      setAvailableExplorers(shuffleArray(explorers));

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
