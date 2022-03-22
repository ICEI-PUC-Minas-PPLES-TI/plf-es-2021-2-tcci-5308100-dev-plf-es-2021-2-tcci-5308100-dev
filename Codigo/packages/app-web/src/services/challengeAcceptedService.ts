import {
  AcceptChallengeDTO,
  AcceptChallengePayload,
  ApiResponse,
  GetAllChallengesAcceptedParams,
  GetAllChallengesAcceptedPayload,
  GetChallengeAcceptedPayload,
  SendChallengeResponseDTO,
  SendChallengeResponsePayload,
} from '@sec/common';
import api from '~/config/api';
import { APIError } from '~/error/APIError';

export type GetAllChallengesAcceptedFilters = GetAllChallengesAcceptedParams;

export const getAllChallengesAccepted = async (filters: GetAllChallengesAcceptedFilters | null) => {
  const { data, headers } = await api.get<ApiResponse<GetAllChallengesAcceptedPayload>>('/challenge-accepted', {
    params: filters,
  });

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getChallengeAccepted = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetChallengeAcceptedPayload>>(`/challenge-accepted/${id}`);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const acceptChallenge = async (challengeResponse: AcceptChallengeDTO) => {
  const { data, headers } = await api.post<ApiResponse<AcceptChallengePayload>>(
    '/challenge-accepted/accept-challenge',
    challengeResponse
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const sendChallengeResponse = async (challengeResponse: SendChallengeResponseDTO) => {
  const { data, headers } = await api.post<ApiResponse<SendChallengeResponsePayload>>(
    '/challenge-accepted/send-response',
    challengeResponse
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
