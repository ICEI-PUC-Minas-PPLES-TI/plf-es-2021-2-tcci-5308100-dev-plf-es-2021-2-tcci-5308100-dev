import React from 'react';

import Header from '~/components/headers/auth';
import Footer from '~/components/footers/auth';
import { Helmet } from 'react-helmet';

const LoginLayout: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <Helmet>
        <title>SEC - Bem vindo, administrador</title>
      </Helmet>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default LoginLayout;
