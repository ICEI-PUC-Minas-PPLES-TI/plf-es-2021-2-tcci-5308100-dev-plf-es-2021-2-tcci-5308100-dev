import { UserType } from '@sec/common';
import CommonLoginView from '@Views/Common/Login';
import { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';

const ExplorerNewAccount = () => {
  const { signIn } = useContext(AuthContext);

  return (
    <CommonLoginView
      cardHeader={
        <>
          <h4>Bem-vindo novo Explorador!</h4>
          Para criar um conta, é necessário já estar cadastrado no nosso E-Commerce
        </>
      }
      showNameField
      onSubmit={(credentials) => signIn(UserType.EXPLORER, credentials)}
      onForgotPassword={{ label: 'Esqueci minha senha', href: '/' }}
      onRequestNewAccount={{ label: 'Criar nova conta', href: '/criar-conta' }}
    />
  );
};

export default ExplorerNewAccount;
