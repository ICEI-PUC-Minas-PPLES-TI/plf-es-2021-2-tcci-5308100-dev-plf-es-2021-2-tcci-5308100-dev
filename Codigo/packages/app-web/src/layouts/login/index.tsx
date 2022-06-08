import React from 'react';

import Header from '~/components/headers/auth';
import Footer from '~/components/footers/auth';
import { Helmet } from 'react-helmet';
import { UserType } from '@sec/common';

type LoginLayoutProps = {
  type: UserType;
};

const LoginLayout: React.FunctionComponent<LoginLayoutProps> = ({ type, children }) => {
  return (
    <>
      <Helmet>
        <title>{type === UserType.EXPLORER ? 'SEC - Bem vindo, explorador' : 'SEC - Bem vindo, administrador'}</title>
      </Helmet>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default LoginLayout;
