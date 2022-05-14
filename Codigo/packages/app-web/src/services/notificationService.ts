import api from '../config/api';
import { ApiResponse, GetUserNotificationsPayload } from '@sec/common';
import { APIError } from '~/error/APIError';

export const getUserNotifications = async () => {
  const { data, headers } = await api.get<ApiResponse<GetUserNotificationsPayload>>('/notification');

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const markNotificationAsRead = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetUserNotificationsPayload>>(`/notification/${id}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
