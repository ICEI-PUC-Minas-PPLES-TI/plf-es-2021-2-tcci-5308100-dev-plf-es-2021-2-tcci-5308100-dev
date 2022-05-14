import React, { createContext, useContext, useEffect, useState } from 'react';
import { Explorer, Post } from '@sec/common';
import { useLocation } from 'react-router-dom';
import { shuffleArray } from '@Utils/util';
import { getAvailablePosts } from '@Services/socialMediaService';
import { getAvailableExplorers } from '@Services/explorerService';
import { AuthContext } from './AuthContext';

interface SocialMediaPostContextState {
  isLoadingPosts: boolean;
  isLoadingExplorers: boolean;
  posts: Post[];
  availableExplorers: Explorer[];
}

const SocialMediaPostContext = createContext<SocialMediaPostContextState>({} as SocialMediaPostContextState);

const SocialMediaPostProvider: React.FunctionComponent = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (
      isAuthenticated() &&
      [
        '/explorador/',
        '/explorador/perfil',
        '/explorador/indicar',
        '/explorador/explorar-publicacoes',
        '/explorador/encontrar-exploradores',
      ].some((pathname) => location.pathname.includes(pathname))
    ) {
      fetchPosts();
      fetchAvailableExplorers();
    }
  }, [location.pathname]);

  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingExplorers, setIsLoadingExplorers] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [availableExplorers, setAvailableExplorers] = useState<Explorer[]>([]);

  const fetchPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const {
        payload: { posts },
      } = await getAvailablePosts();

      setPosts(shuffleArray(posts));

      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const fetchAvailableExplorers = async () => {
    try {
      setIsLoadingExplorers(true);
      const {
        payload: { explorers },
      } = await getAvailableExplorers();

      setAvailableExplorers(shuffleArray(explorers));

      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoadingExplorers(false);
    }
  };

  return (
    <SocialMediaPostContext.Provider value={{ posts, availableExplorers, isLoadingPosts, isLoadingExplorers }}>
      {children}
    </SocialMediaPostContext.Provider>
  );
};

export { SocialMediaPostContext, SocialMediaPostProvider };
