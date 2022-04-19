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
import AdministratorDashboard from '@Pages/administrator/dashboard';
import AdministratorAdministrators from '@Pages/administrator/administrators';
import AdministratorAdministratorsSave from '@Pages/administrator/administrators/save';
import AdministratorExplorers from '@Pages/administrator/explorers';
import AdministratorChallenges from '@Pages/administrator/challenges';
import AdministratorChallengesSave from '@Pages/administrator/challenges/save';
import AdministratorChallengesAccepted from '@Pages/administrator/challenges-accepted';
import AdministratorChallengesAcceptedSave from '@Pages/administrator/challenges-accepted/save';
import AdministratorRecompenses from '@Pages/administrator/recompenses';
import AdministratorRecompensesSave from '@Pages/administrator/recompenses/save';
import AdministratorSocialMedias from '@Pages/administrator/social-medias';
import AdministratorSocialMediasSave from '@Pages/administrator/social-medias/save';

import ExplorerLogin from '@Pages/explorer/login';
import ExplorerNewAccount from '@Pages/explorer/login/NewAccount';

import ExplorerHome from '@Pages/explorer/home';
import ExplorerExplorerProfile from '@Pages/explorer/explorer-profile';
import ExplorerChallengeAccepted from '@Pages/explorer/explorer-profile/ChallengeAccepted';
import ExplorerChallenge from '@Pages/explorer/home/Challenge';
import ExplorerIndicate from '@Pages/explorer/indicate';

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
    component: AdministratorDashboard,
    show: true,
    hasNavMenu: true,
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
    path: urlPrefix[UserType.ADMINISTRATOR] + '/desafios-aceitos',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    label: 'Desafios aceitos',
    iconClass: 'fas fa-check-circle',
    component: AdministratorChallengesAccepted,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/desafios-aceitos/salvar',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorChallengesAcceptedSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/desafios-aceitos/salvar/:id',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorChallengesAcceptedSave,
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
    component: AdministratorRecompenses,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/recompensas/salvar',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorRecompensesSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/recompensas/salvar/:id',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorRecompensesSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/redes-sociais',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    label: 'Redes Sociais',
    iconClass: 'fas fa-hashtag',
    component: AdministratorSocialMedias,
    show: true,
    hasNavMenu: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/redes-sociais/salvar',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorSocialMediasSave,
    show: false,
  },
  {
    path: urlPrefix[UserType.ADMINISTRATOR] + '/redes-sociais/salvar/:id',
    allowedUsers: [UserType.SUPER_ADMINISTRATOR, UserType.ADMINISTRATOR],
    component: AdministratorSocialMediasSave,
    show: false,
  },
];

const routesExplorer: RouteSettings[] = [
  {
    path: urlPrefix[UserType.EXPLORER] + '/',
    allowedUsers: [UserType.EXPLORER],
    label: 'Home',
    iconClass: 'fas fa-home',
    component: ExplorerHome,
    show: true,
    hasNavMenu: true,
  },
  {
    path: urlPrefix[UserType.EXPLORER] + '/perfil',
    allowedUsers: [UserType.EXPLORER],
    label: 'Perfil',
    iconClass: 'fas fa-hand-sparkles',
    component: ExplorerExplorerProfile,
    show: true,
    hasNavMenu: true,
  },
  {
    path: urlPrefix[UserType.EXPLORER] + '/desafio-aceito/:id',
    allowedUsers: [UserType.EXPLORER],
    component: ExplorerChallengeAccepted,
    show: false,
  },
  {
    path: urlPrefix[UserType.EXPLORER] + '/desafio/:id',
    allowedUsers: [UserType.EXPLORER],
    component: ExplorerChallenge,
    show: false,
  },
  {
    path: urlPrefix[UserType.EXPLORER] + '/indicar',
    allowedUsers: [UserType.EXPLORER],
    label: 'Indicar',
    iconClass: 'fas fa-share-alt',
    component: ExplorerIndicate,
    show: true,
    hasNavMenu: false,
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
    const allowedRoutes: RouteSettings[] = routes.filter((route) =>
      allowedUsers.some((r) => route.allowedUsers.includes(r))
    );

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
                        <RouteWithRoleGuard allowedUsers={route.allowedUsers}>
                          {React.createElement(route.component)}
                        </RouteWithRoleGuard>
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
          <div
            style={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <a href='/login'>explorador</a>
            <a href='/administrador/login'>administrador</a>
          </div>
        }
      />
      <Route path='/login' element={<LoginLayout type={UserType.EXPLORER}>{<ExplorerLogin />}</LoginLayout>} />
      <Route path='/criar-conta' element={<LoginLayout type={UserType.EXPLORER}>{<ExplorerNewAccount />}</LoginLayout>} />
      <Route
        path='/administrador/login'
        element={<LoginLayout type={UserType.ADMINISTRATOR}>{<AdministratorLogin />}</LoginLayout>}
      />
      <Route path='/nao-autorizado' element={<Error403 fullPage />} />
      <Route path='/*' element={<Error404 fullPage />} />
    </ReactRoutes>
  );
};

export default Routes;
export { urlPrefix, routes };
