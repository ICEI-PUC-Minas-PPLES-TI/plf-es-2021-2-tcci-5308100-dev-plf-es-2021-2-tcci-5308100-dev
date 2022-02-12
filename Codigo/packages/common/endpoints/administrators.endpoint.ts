import { Administrator, AdministratorStatus } from '../models/Administrator';

export type GetAllAdministratorsParams = {
  status?: AdministratorStatus[];
};

export type GetAllAdministratorsPayload = {
  administrators: Administrator[];
};

export type GetAdministratorPayload = {
  administrator: Administrator;
};
