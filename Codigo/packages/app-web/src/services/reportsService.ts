import { ApiResponse, GetDashboardDataParams, GetDashboardDataPayload } from '@sec/common';
import api from '~/config/api';
import { APIError } from '~/error/APIError';

export const getDashboardData = async (filters: GetDashboardDataParams) => {
  const { data, headers } = await api.get<ApiResponse<GetDashboardDataPayload>>('/reports/dashboard', {
    params: filters,
  });

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
