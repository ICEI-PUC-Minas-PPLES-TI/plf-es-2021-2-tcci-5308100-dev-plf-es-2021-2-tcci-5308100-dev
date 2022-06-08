import React, { useContext } from 'react';

// core components
import MainSidebar from '~/components/sidebars/main/';
import Header from '~/components/headers/main';
import { HeaderMenuLink } from '@Components/headers/main/types';
import { RouteSettings, RouteSettingsShowed } from '~/routes/types';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '~/context/AuthContext';

interface MainLayoutProps {
  routes: RouteSettings[];
}

const MainLayout: React.FunctionComponent<MainLayoutProps> = ({ children, routes }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const getPageTitle = (pathname: string) => {
    //TODO: Definir frase
    const defaultPageTitle = 'SEC - Bem vindo ao SEC';
    const route = routes.find((route) => route.path === pathname);

    return route?.tabHeader || defaultPageTitle;
  };

  const centerMenus: HeaderMenuLink[] = routes
    .filter((route): route is RouteSettingsShowed => route.show && route.hasNavMenu)
    .map((route) => ({
      type: 'LINK',
      iconClass: route.iconClass,
      label: route.label,
      href: route.path,
      withBackground: true,
    }));

  return (
    <>
      <Helmet>
        <title>{getPageTitle(location.pathname)}</title>
      </Helmet>
      <Header centerMenus={centerMenus} />
      <div className='container-fluid wrapper pt-2 px-3'>
        <div className='row' style={{ minHeight: 'calc(100vh - 120px)' }}>
          <MainSidebar routes={routes.filter((route) => route.allowedUsers.includes(user.type))} />
          <main className='ms-sm-auto ps-sm-3 ps-md-0 pb-2' style={{ minHeight: 'calc(100vh - 120px)' }}>
            {children}
          </main>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default MainLayout;
