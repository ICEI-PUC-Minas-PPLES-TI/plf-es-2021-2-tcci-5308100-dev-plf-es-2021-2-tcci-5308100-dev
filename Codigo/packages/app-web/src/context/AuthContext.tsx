import React, { createContext, useCallback, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { loginAdministrator, loginExplorer } from '@Services/authenticationService';
import { Token, UserType } from '@sec/common';
import { APIError } from '~/error/APIError';
import moment from 'moment';

interface SignInCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface UserContext extends Token {
  id: number;
  name: string;
  email: string;
  type: UserType;
}

interface AuthState {
  user: UserContext;
}

interface SignIn {
  message: string;
}

export interface SignInSuccess extends SignIn {
  status: 'SUCCESS';
  type: UserType;
}

export interface SignInWarning extends SignIn {
  status: 'WARNING';
  type: null;
}

export interface SignInFail extends SignIn {
  status: 'FAIL';
  type: null;
}

interface AuthContextState {
  user: UserContext;
  signIn(type: UserType, credentials: SignInCredentials): Promise<SignInSuccess | SignInWarning | SignInFail>;
  signOut(): void;
  isAuthenticated(): boolean;
}

const AuthContext = createContext<AuthContextState>({} as AuthContextState);

const AuthProvider: React.FunctionComponent = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const user = localStorage.getItem('@sec:user');

    if (user) {
      return {
        user: JSON.parse(user),
      };
    }

    return {} as AuthState;
  });

  const signIn = useCallback<
    (type: UserType, credentials: SignInCredentials) => Promise<SignInSuccess | SignInWarning | SignInFail>
  >(async (type, { email, password, name }) => {
    try {
      const { status, payload, message } =
        type === UserType.ADMINISTRATOR
          ? await loginAdministrator({
              email,
              password,
              name,
            })
          : await loginExplorer({
              email,
              password,
              name,
            });

      if (status === 'WARNING') {
        return {
          status: 'WARNING',
          type: null,
          message: message,
        };
      } else {
        localStorage.setItem('@sec:user', JSON.stringify(payload.user));
        localStorage.setItem('@sec:token', payload.token);

        setData({ user: payload.user });
        return {
          status: 'SUCCESS',
          type: payload.user.type,
          message: '',
        };
      }
    } catch (error: any) {
      if (error instanceof APIError) {
        return {
          status: 'FAIL',
          type: null,
          message: error.message,
        };
      } else {
        return {
          status: 'FAIL',
          type: null,
          message: 'Erro interno. Tente recarregar a página',
        };
      }
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@sec:user');
    localStorage.removeItem('@sec:token');

    setData({} as AuthState);
  }, []);

  const isAuthenticated = useCallback(() => {
    try {
      const token = localStorage.getItem('@sec:token');
      if (token === null) {
        return false;
      } else {
        const tokenDecoded = jwtDecode<Token & { iat: number; exp: number }>(token);
        const timestamp = moment().valueOf();

        return !!tokenDecoded && tokenDecoded.exp * 1000 >= timestamp ? true : false;
      }
    } catch (error) {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
