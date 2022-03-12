import React, { createContext, useCallback, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { loginAdministrator, loginExplorer } from '@Services/authenticationService';
import { Token, UserType } from '@sec/common';
import { APIError } from '~/error/APIError';
import moment from 'moment';

interface SignInCredentials {
  email: string;
  password: string;
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
  success: true;
  type: UserType;
}
export interface SignInFail extends SignIn {
  success: false;
  type: null;
}

interface AuthContextState {
  user: UserContext;
  signIn(type: UserType, credentials: SignInCredentials): Promise<SignInSuccess | SignInFail>;
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

  const signIn = useCallback<(type: UserType, credentials: SignInCredentials) => Promise<SignInSuccess | SignInFail>>(
    async (type, { email, password }) => {
      try {
        const {
          payload: { token, user },
        } =
          type === UserType.ADMINISTRATOR
            ? await loginAdministrator({
                email,
                password,
              })
            : await loginExplorer({
                email,
                password,
              });

        localStorage.setItem('@sec:user', JSON.stringify(user));
        localStorage.setItem('@sec:token', token);

        setData({ user: user });
        return {
          success: true,
          type: user.type,
          message: '',
        };
      } catch (error: any) {
        if (error instanceof APIError) {
          return {
            success: false,
            type: null,
            message: error.message,
          };
        } else {
          return {
            success: false,
            type: null,
            message: 'Erro interno. Tente recarregar a página',
          };
        }
      }
    },
    []
  );

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
