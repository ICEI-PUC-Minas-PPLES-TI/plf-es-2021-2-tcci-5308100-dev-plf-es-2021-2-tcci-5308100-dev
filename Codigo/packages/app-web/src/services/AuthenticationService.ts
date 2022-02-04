import api from '../config/api';
import { APIError } from '~/error/APIError';
import { ApiResponse, Token } from '@sec/common';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data } = await api.post<ApiResponse<{ token: string; user: Token }>>(
    '/authentication/login',
    {
      email,
      password,
    },
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data);
  }
};
