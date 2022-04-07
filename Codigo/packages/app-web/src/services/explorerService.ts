import api from '../config/api';
import {
  ApiResponse,
  CreateExplorerDTO,
  GetExplorerPayload,
  GetAllExplorersParams,
  GetAllExplorersPayload,
  UpdateExplorerDTO,
  Explorer,
  ActiveExplorersParams,
  ActiveExplorersPayload,
  BanExplorersParams,
  BanExplorersPayload,
} from '@sec/common';
import { APIError } from '~/error/APIError';

export type GetAllExplorersFilters = GetAllExplorersParams;

export const getAllExplorers = async (filters: GetAllExplorersFilters | null) => {
  const { data, headers } = await api.get<ApiResponse<GetAllExplorersPayload>>('/explorer', { params: filters });

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getExplorer = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetExplorerPayload>>(`/explorer/${id}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const createExplorer = async (explorer: CreateExplorerDTO) => {
  const { data, headers } = await api.post<ApiResponse<GetAllExplorersPayload>>('/explorer', explorer);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const updateExplorer = async (explorer: UpdateExplorerDTO) => {
  const { data, headers } = await api.put<ApiResponse<GetExplorerPayload>>('/explorer', explorer);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const activeExplorers = async (explorers: ActiveExplorersParams) => {
  const { data, headers } = await api.put<ApiResponse<ActiveExplorersPayload>>('/explorer/active-explorers', explorers);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const banExplorers = async (explorers: BanExplorersParams) => {
  const { data, headers } = await api.put<ApiResponse<BanExplorersPayload>>('/explorer/ban-explorers', explorers);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
