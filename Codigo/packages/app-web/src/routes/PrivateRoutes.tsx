import Error403 from '@Pages/error403';
import { UserType } from '@sec/common';
import React, { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRoutesInterface {
  children: ReactNode;
  allowedUsers: UserType[];
  loginPage: string;
}

const PrivateRoutes: React.FunctionComponent<PrivateRoutesInterface> = ({ allowedUsers, children, loginPage }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated()) {
    return <Navigate to={loginPage} />;
  } else if (allowedUsers.includes(user.type)) {
    return <>{children}</>;
  } else {
    return <Error403 />;
  }
};

export default PrivateRoutes;
