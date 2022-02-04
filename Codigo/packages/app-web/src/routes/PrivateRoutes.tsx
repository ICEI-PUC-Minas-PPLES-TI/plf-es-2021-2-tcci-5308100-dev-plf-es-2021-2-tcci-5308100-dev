import { UserType } from '@sec/common';
import React, { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRoutesInterface {
  children: ReactNode;
  allowedUser: UserType[];
}

const PrivateRoutes: React.FunctionComponent<PrivateRoutesInterface> = ({ allowedUser, children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated()) {
    return <Navigate to='/' />;
  } else if (allowedUser.includes(user.type)) {
    return <>{children}</>;
  } else {
    return <Navigate to='/nao-autorizado' />;
  }
};

export default PrivateRoutes;
