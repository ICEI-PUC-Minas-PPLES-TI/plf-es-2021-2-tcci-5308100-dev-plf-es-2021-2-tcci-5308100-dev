import { User } from './User';

export enum AdministratorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Administrator extends User {
  password: string;
  isSuper: boolean;
  status: AdministratorStatus;
}
