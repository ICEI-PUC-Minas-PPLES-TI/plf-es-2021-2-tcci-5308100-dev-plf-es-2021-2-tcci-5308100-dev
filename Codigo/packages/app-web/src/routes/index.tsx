import React from 'react';
import { Routes as ReactRoutes, Route } from 'react-router-dom';

import { RouteSettings } from './types';
import { UserType } from '@sec/common';

import MainLayout from '~/layouts/main';
import LoginLayout from '~/layouts/login';

import PrivateRoutes from './PrivateRoutes';
import { RouteWithRoleGuard } from './RouteWithRoleGuard';

import Error403 from '~/pages/error403';
import Error404 from '~/pages/error404';
import ErrorCatcher from '~/components/error/ErrorCatcher';

import AdministratorLogin from '@Pages/administrator/login';
import AdministratorAdministrators from '@Pages/administrator/administrators';
import AdministratorAdministratorsSave from '@Pages/administrator/administrators/save';
import AdministratorExplorers from '@Pages/administrator/explorers';
import AdministratorChallenges from '@Pages/administrator/challenges';
import AdministratorChallengesSave from '@Pages/administrator/challenges/save';

import ExplorerLogin from '@Pages/explorer/login';

const urlPrefix = {
  [UserType.SUPER_ADMINISTRATOR]: '/administrador',
  [UserType.ADMINISTRATOR]: '/administrador',
  [UserType.EXPLORER]: '/explorador',
};

const routesAdministrator: RouteSettings[] = [
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    label: 'Dashboard',
    iconClass: 'fas fa-chart-line',
    component: () => <div>Dashboard</div>,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/desafios',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    label: 'Desafios',
    iconClass: 'fas fa-hand-sparkles',
    component: AdministratorChallenges,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/desafios/salvar',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorChallengesSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/desafios/salvar/:id',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorChallengesSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.SUPER_ADMINISTRATOR] + '/administradores',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR],
    label: 'Administradores',
    iconClass: 'fas fa-user-tie',
    component: AdministratorAdministrators,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.SUPER_ADMINISTRATOR] + '/administradores/salvar',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR],
    component: AdministratorAdministratorsSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.SUPER_ADMINISTRATOR] + '/administradores/salvar/:id',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR],
    component: AdministratorAdministratorsSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/exploradores',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    label: 'Exploradores',
    iconClass: 'fas fa-user-friends',
    component: AdministratorExplorers,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/recompensas',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    label: 'Recompensas',
    iconClass: 'fas fa-gift',
    component: () => <div>Recompensas</div>,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/recompensas/salvar',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: () => <div>Recompensas</div>,
    show: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/recompensas/salvar/:id',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: () => <div>Recompensas</div>,
    show: false,
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
    allowedUsers,
    routes,
    urlPrefix,
    loginPage,
  }: {
    allowedUsers: UserType[];
    routes: RouteSettings[];
    urlPrefix: string;
    loginPage: string;
  }) => {
    const allowedRoutes: RouteSettings[] = routes.filter((route) => allowedUsers.some((r) => route.allowedUsers.includes(r)));

    return (
      <Route
        path={urlPrefix + '/*'}
        element={
          <PrivateRoutes allowedUsers={allowedUsers} loginPage={loginPage}>
            <MainLayout routes={allowedRoutes}>
              <ReactRoutes>
                {allowedRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path.replace(urlPrefix, '')}
                    element={
                      <ErrorCatcher>
                        <RouteWithRoleGuard allowedUsers={route.allowedUsers}>{React.createElement(route.component)}</RouteWithRoleGuard>
                      </ErrorCatcher>
                    }
                  />
                ))}
                <Route path={'/nao-autorizado'} element={<Error403 />} />
                <Route path={'/*'} element={<Error404 />} />
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
        allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
        routes: routes,
        urlPrefix: urlPrefix[UserType.ADMINISTRATOR],
        loginPage: '/administrador/login',
      })}

      {createPrivateRoutes({
        allowedUsers: [UserType.EXPLORER],
        routes: routes,
        urlPrefix: urlPrefix[UserType.EXPLORER],
        loginPage: '/login',
      })}

      <Route
        path='/'
        element={
          <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <a href='/login'>explorador</a>
            <a href='/administrador/login'>administrador</a>
          </div>
        }
      />
      <Route path='/login' element={<LoginLayout>{<ExplorerLogin />}</LoginLayout>} />
      <Route path='/administrador/login' element={<LoginLayout>{<AdministratorLogin />}</LoginLayout>} />
      <Route path='/nao-autorizado' element={<Error403 fullPage />} />
      <Route path='/*' element={<Error404 fullPage />} />
    </ReactRoutes>
  );
};

export default Routes;
export { urlPrefix, routes };
