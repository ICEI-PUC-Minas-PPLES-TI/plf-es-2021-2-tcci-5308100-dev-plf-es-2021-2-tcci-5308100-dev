import api from '../config/api';
import { APIError } from '~/error/APIError';
import { ApiResponse, AuthenticationPayload } from '@sec/common';

export const loginAdministrator = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data, headers } = await api.post<ApiResponse<AuthenticationPayload>>(
    '/administrator/login',
    {
      email,
      password,
    }
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const loginExplorer = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data, headers } = await api.post<ApiResponse<AuthenticationPayload>>(
    '/explorer/login',
    {
      email,
      password,
    }
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
