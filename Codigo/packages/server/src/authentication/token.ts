import { Token, UserType } from '@sec/common';

export class TokenClass implements Token {
  id: number;
  email: string;
  name: string;
  type: UserType;
}
