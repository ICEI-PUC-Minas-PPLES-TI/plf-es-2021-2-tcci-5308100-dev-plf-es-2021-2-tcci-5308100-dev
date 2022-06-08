import { UserType } from '@sec/common';
import CommonLoginView from '@Views/Common/Login';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';

const ExplorerLogin = () => {
  const { signIn } = useContext(AuthContext);

  return (
    <CommonLoginView
      cardHeader={
        <>
          <h4>Bem-vindo, Explorador!</h4>
          Faça login um sua conta utilizando sua conta Shopify
        </>
      }
      onSubmit={(credentials) => signIn(UserType.EXPLORER, credentials)}
      onForgotPassword={{ label: 'Esqueci minha senha', href: '/' }}
      onRequestNewAccount={{ label: 'Criar nova conta', href: '/criar-conta' }}
    />
  );
};

export default ExplorerLogin;
