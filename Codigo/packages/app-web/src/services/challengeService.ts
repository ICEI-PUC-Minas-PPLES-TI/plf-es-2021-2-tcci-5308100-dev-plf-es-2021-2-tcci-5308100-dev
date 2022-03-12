import api from '../config/api';
import {
  ApiResponse,
  CreateChallengeDTO,
  GetChallengePayload,
  GetAllChallengesParams,
  GetAllChallengesPayload,
  UpdateChallengeDTO,
} from '@sec/common';
import { APIError } from '~/error/APIError';

export type GetAllChallengesFilters = GetAllChallengesParams;

export const getAllChallenges = async (filters: GetAllChallengesFilters | null) => {
  const { data, headers } = await api.get<ApiResponse<GetAllChallengesPayload>>('/challenge', { params: filters });

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getChallenge = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetChallengePayload>>(`/challenge/${id}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const createChallenge = async (challenge: CreateChallengeDTO) => {
  const { data, headers } = await api.post<ApiResponse<GetChallengePayload>>('/challenge', challenge);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const updateChallenge = async (challenge: UpdateChallengeDTO) => {
  const { data, headers } = await api.put<ApiResponse<GetChallengePayload>>('/challenge', challenge);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
