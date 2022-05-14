import api from '../config/api';
import {
  ApiResponse,
  CreateRecompenseDTO,
  GetRecompensePayload,
  GetAllRecompensesParams,
  GetAllRecompensesPayload,
  UpdateRecompenseDTO,
  GetRecompenseBasePayload,
} from '@sec/common';
import { APIError } from '~/error/APIError';

export type GetAllRecompensesFilters = GetAllRecompensesParams;

export const getAllRecompenses = async (filters: GetAllRecompensesFilters | null) => {
  const { data, headers } = await api.get<ApiResponse<GetAllRecompensesPayload>>('/recompense', { params: filters });

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getRecompenseBase = async () => {
  const { data, headers } = await api.get<ApiResponse<GetRecompenseBasePayload>>('/recompense/base');

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getRecompense = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetRecompensePayload>>(`/recompense/${id}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const createRecompense = async (recompense: CreateRecompenseDTO) => {
  const { data, headers } = await api.post<ApiResponse<GetRecompensePayload>>('/recompense', recompense);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const updateRecompense = async (recompense: UpdateRecompenseDTO) => {
  const { data, headers } = await api.put<ApiResponse<GetRecompensePayload>>('/recompense', recompense);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
