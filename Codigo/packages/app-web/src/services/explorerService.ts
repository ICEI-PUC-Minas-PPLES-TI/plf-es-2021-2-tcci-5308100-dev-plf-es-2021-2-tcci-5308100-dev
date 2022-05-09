import api from '~/config/api';
import {
  ApiResponse,
  CreateExplorerDTO,
  GetExplorerPayload,
  GetAllExplorersParams,
  GetAllExplorersPayload,
  UpdateExplorerDTO,
  ActiveExplorersParams,
  ActiveExplorersPayload,
  BanExplorersParams,
  BanExplorersPayload,
  UpdateExplorerProfileDTO,
  GetAvailableExplorersPayload,
  SearchExplorersPayload,
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

export const getExplorerProfile = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetExplorerPayload>>(`/explorer/profile/${id}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

const serializeExplorerProfile = (explorer: UpdateExplorerProfileDTO, newAvatar?: File): FormData => {
  const formData = new FormData();
  formData.append('object', JSON.stringify(explorer));
  if (newAvatar) formData.append('newAvatar', newAvatar);

  return formData;
};

export const updateExplorerProfile = async (explorer: UpdateExplorerProfileDTO, newAvatar: File) => {
  const { data, headers } = await api.put<ApiResponse<GetExplorerPayload>>(
    '/explorer/profile',
    serializeExplorerProfile(explorer, newAvatar)
  );

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

export const indicateExplorer = async (request: { email: string }) => {
  const { data, headers } = await api.post<ApiResponse<null>>('/explorer/indicate-explorer', request);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getAvailableExplorers = async (all = false) => {
  const { data, headers } = await api.get<ApiResponse<GetAvailableExplorersPayload>>('/explorer/available', {
    params: { all },
  });

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const searchExplorers = async (name: string) => {
  const { data, headers } = await api.get<ApiResponse<SearchExplorersPayload>>(`/explorer/search-explorers/${name}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
