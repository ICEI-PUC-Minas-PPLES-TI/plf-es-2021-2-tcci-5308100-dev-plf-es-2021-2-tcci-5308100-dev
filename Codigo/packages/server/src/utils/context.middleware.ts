import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { TokenClass } from '~/authentication/token';
import { DeepPartial } from 'typeorm';
import { User, Token } from '@sec/common';

export class RequestContextStorage {
  static context = new AsyncLocalStorage<Token>();

  static start: () => void = () => {
    RequestContextStorage.context.enterWith(new TokenClass());
  };

  static setToken: (token: Token) => void = (token) => {
    const tokenStored = RequestContextStorage.context.getStore();
    Object.keys(token).forEach((param) => {
      tokenStored[param] = token[param];
    });
  };

  static getStore: () => Token = () => {
    return RequestContextStorage.context.getStore();
  };

  static getUser: () => DeepPartial<User> = () => {
    const userToken = RequestContextStorage.getStore();

    if (userToken) return userToken;
    else return undefined;
  };
}

export function requestContextMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  RequestContextStorage.start();
  next();
}
