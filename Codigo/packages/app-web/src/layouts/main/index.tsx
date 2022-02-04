import React from 'react';

// core components
import MainSidebar from '~/components/sidebars/main/';
import Header from '~/components/headers/main';
import { HeaderMenuLink } from '@Components/headers/main/types';
import { RouteSettings } from '@GlobalTypes';

interface MainLayoutProps {
  routes: RouteSettings[];
}

const MainLayout: React.FunctionComponent<MainLayoutProps> = ({ children, routes }) => {
  const centerMenus: HeaderMenuLink[] = routes
    .filter((route) => route.hasNavMenu)
    .map((route) => ({
      type: 'LINK',
      iconClass: route.iconClass,
      label: route.label,
      href: route.path,
      withBackground: true,
    }));

  return (
    <>
      <Header centerMenus={centerMenus} leftMenus={[]} />
      <div className='container-fluid wrapper pt-2 px-3'>
        <div className='row'>
          <MainSidebar routes={routes} />
          <main className='col-md-9 ms-sm-auto col-lg-9 px-md-4'>{children}</main>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default MainLayout;
