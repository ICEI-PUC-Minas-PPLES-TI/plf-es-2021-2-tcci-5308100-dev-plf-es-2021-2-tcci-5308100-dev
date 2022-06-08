import api from '../config/api';
import {
  ApiResponse,
  CreateAdministratorDTO,
  GetAdministratorPayload,
  GetAllAdministratorsParams,
  GetAllAdministratorsPayload,
  UpdateAdministratorDTO,
} from '@sec/common';
import { APIError } from '~/error/APIError';

export type GetAllAdministratorsFilters = GetAllAdministratorsParams;

export const getAllAdministrators = async (filters: GetAllAdministratorsFilters | null) => {
  const { data, headers } = await api.get<ApiResponse<GetAllAdministratorsPayload>>('/administrator', {
    params: filters,
  });

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getAdministrator = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetAdministratorPayload>>(`/administrator/${id}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const createAdministrator = async (administrator: CreateAdministratorDTO) => {
  const { data, headers } = await api.post<ApiResponse<GetAdministratorPayload>>('/administrator', administrator);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const updateAdministrator = async (administrator: UpdateAdministratorDTO) => {
  const { data, headers } = await api.put<ApiResponse<GetAdministratorPayload>>('/administrator', administrator);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
