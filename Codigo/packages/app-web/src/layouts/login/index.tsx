import React from 'react';

import Header from '~/components/headers/auth';
import Footer from '~/components/footers/auth';

const LoginLayout: React.FunctionComponent = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default LoginLayout;
