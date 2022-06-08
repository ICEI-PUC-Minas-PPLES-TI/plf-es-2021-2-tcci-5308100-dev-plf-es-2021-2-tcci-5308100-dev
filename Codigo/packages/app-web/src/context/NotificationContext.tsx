import React, { createContext, useContext, useEffect, useState } from 'react';
import { Explorer, Notification, Post } from '@sec/common';
import { useLocation } from 'react-router-dom';
import { shuffleArray } from '@Utils/util';
import { getAvailablePosts } from '@Services/socialMediaService';
import { getAvailableExplorers } from '@Services/explorerService';
import { AuthContext } from './AuthContext';
import { getUserNotifications } from '@Services/notificationService';

interface NotificationContextState {
  isLoading: boolean;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
}

const NotificationContext = createContext<NotificationContextState>({} as NotificationContextState);

const NotificationProvider: React.FunctionComponent = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchNotifications();
    }
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const {
        payload: { notifications },
      } = await getUserNotifications();

      setNotifications(notifications);

      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NotificationContext.Provider value={{ isLoading, notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationProvider };
