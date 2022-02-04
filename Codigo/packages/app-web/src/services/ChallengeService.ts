import { ApiResponse } from '@sec/common';
import api from '~/config/api';
import { APIError } from '~/error/APIError';

export const createChallenge = async () => {
  const { data } = await api.post<ApiResponse<object>>('', {});

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data);
  }
};
