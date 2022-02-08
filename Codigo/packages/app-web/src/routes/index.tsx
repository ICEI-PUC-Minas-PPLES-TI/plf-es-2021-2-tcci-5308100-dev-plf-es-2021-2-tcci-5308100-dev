import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';

import { RouteSettings } from '@GlobalTypes';
import { UserType } from '@sec/common';

import MainLayout from '~/layouts/main';
import LoginLayout from '~/layouts/login';

import PrivateRoutes from './PrivateRoutes';

import Error403 from '~/pages/error403';
import Error404 from '~/pages/error404';
import ErrorCatcher from '~/components/error/ErrorCatcher';

// const AdministratorLogin = 'AdministratorLogin';
import AdministratorLogin from '@Pages/administrator/login';

import ExplorerLogin from '@Pages/explorer/login';
import Administrators from '@Pages/administrator/administrators';

const urlPrefix = {
  [UserType.ADMINISTRATOR]: '/administrador',
  [UserType.EXPLORER]: '/explorador',
};

const routesAdministrator: RouteSettings[] = [
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/',
    allowedUsers: [UserType.ADMINISTRATOR],
    label: 'Dashboard',
    iconClass: 'fas fa-chart-line',
    component: () => <div>Dashboard</div>,
    show: true,
    hasNavMenu: true,
    bgClass: '',
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/desafios',
    allowedUsers: [UserType.ADMINISTRATOR],
    label: 'Desafios',
    iconClass: 'fas fa-hand-sparkles',
    component: () => <div>Desafios</div>,
    show: true,
    hasNavMenu: true,
    bgClass: '',
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/administradores',
    allowedUsers: [UserType.ADMINISTRATOR],
    label: 'Administradores',
    iconClass: 'fas fa-user-tie',
    component: Administrators,
    show: true,
    hasNavMenu: false,
    bgClass: '',
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/exploradores',
    allowedUsers: [UserType.ADMINISTRATOR],
    label: 'Exploradores',
    iconClass: 'fas fa-user-friends',
    component: () => <div>Exploradores</div>,
    show: true,
    hasNavMenu: false,
    bgClass: '',
  },
];

const routesExplorer: RouteSettings[] = [
  {
    path: urlPrefix[UserType.EXPLORER] + '/',
    allowedUsers: [UserType.EXPLORER],
    label: 'Home',
    iconClass: 'fas fa-home',
    component: () => <div>teste</div>,
    show: true,
    hasNavMenu: true,
  },
];

const routes = [...routesAdministrator, ...routesExplorer];

const Routes: React.FunctionComponent = () => {
  const createPrivateRoutes = ({
    allowedUser,
    layoutType,
    routes,
    urlPrefix,
  }: {
    allowedUser: UserType[];
    layoutType: UserType;
    routes: RouteSettings[];
    urlPrefix: string;
  }) => {
    const allowedRoutes: RouteSettings[] = routes.filter((route) => allowedUser.some((r) => route.allowedUsers.includes(r)));

    return (
      <Route
        path={urlPrefix + '/*'}
        element={
          <PrivateRoutes allowedUser={allowedUser}>
            <MainLayout routes={allowedRoutes}>
              <ReactRoutes>
                {allowedRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path.replace(urlPrefix, '')}
                    element={<ErrorCatcher>{React.createElement(route.component)}</ErrorCatcher>}
                  />
                ))}
                <Route path={'/*'} element={<div className='min-window-size d-flex justify-content-center align-items-center'>Erro 404</div>} />
              </ReactRoutes>
            </MainLayout>
          </PrivateRoutes>
        }
      />
    );
  };

  return (
    <ReactRoutes>
      {createPrivateRoutes({
        allowedUser: [UserType.ADMINISTRATOR],
        layoutType: UserType.ADMINISTRATOR,
        routes: routes,
        urlPrefix: urlPrefix[UserType.ADMINISTRATOR],
      })}
      {createPrivateRoutes({
        allowedUser: [UserType.EXPLORER],
        layoutType: UserType.EXPLORER,
        routes: routes,
        urlPrefix: urlPrefix[UserType.EXPLORER],
      })}

      <Route path='/login' element={<LoginLayout>{<ExplorerLogin />}</LoginLayout>} />
      <Route path='/administrador/login' element={<LoginLayout>{<AdministratorLogin />}</LoginLayout>} />
      <Route path='/nao-autorizado' element={<Error403 />} />
      <Route path='/*' element={<Error404 />} />
    </ReactRoutes>
  );
};

export default Routes;
export { urlPrefix, routes };
