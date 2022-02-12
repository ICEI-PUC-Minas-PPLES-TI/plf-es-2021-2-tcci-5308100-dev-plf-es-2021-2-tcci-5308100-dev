import { RouteSettings } from '@GlobalTypes';
import Error403 from '@Pages/error403';
import { UserType } from '@sec/common';
import { useContext } from 'react';
import { Route, PathRouteProps, LayoutRouteProps, IndexRouteProps, Navigate } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';

export type RouteWithRoleGuard = {
  allowedUsers: UserType[];
  children: JSX.Element;
};

export const RouteWithRoleGuard: (props: RouteWithRoleGuard) => React.ReactElement | null = ({ allowedUsers, children }) => {
  const { user } = useContext(AuthContext);

  if (allowedUsers.includes(user.type)) {
    return children;
  } else {
    return <Error403 />;
  }
};
