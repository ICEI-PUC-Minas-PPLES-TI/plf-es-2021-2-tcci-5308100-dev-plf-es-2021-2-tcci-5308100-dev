import { UserType } from '@sec/common';
import CommonLoginView from '@Views/Common/Login';
import React, { useContext } from 'react';
import { AuthContext } from '~/context/AuthContext';

const AdministratorLogin = () => {
  const { signIn } = useContext(AuthContext);
  return (
    <CommonLoginView
      cardHeader={
        <>
          <h4>Bem-vindo, Administrador!</h4>
          Faça login um sua conta
        </>
      }
      onSubmit={(credentials) => signIn(UserType.ADMINISTRATOR, credentials)}
    />
  );
};

export default AdministratorLogin;
