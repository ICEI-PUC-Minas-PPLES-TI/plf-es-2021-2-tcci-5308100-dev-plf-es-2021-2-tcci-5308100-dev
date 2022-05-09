import {
  AcceptChallengeDTO,
  AcceptChallengePayload,
  AcceptResponseDTO,
  ApiResponse,
  DeclineResponseDTO,
  GetAllChallengesAcceptedParams,
  GetAllChallengesAcceptedPayload,
  GetChallengeAcceptedPayload,
  GetReadOnlyChallengeAcceptedPayload,
  RedeemRecompensePayload,
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

export const getReadOnlyChallengeAccepted = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetReadOnlyChallengeAcceptedPayload>>(
    `/challenge-accepted/read-only/${id}`
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

const serializeResponse = (
  challenge: AcceptChallengeDTO | SendChallengeResponseDTO,
  files?: File[],
  images?: File[]
): FormData => {
  const formData = new FormData();
  formData.append('object', JSON.stringify(challenge));

  files?.forEach((file, i) => formData.append(`files`, file));
  images?.forEach((image, i) => formData.append(`images`, image));

  return formData;
};

export const acceptChallenge = async (challengeResponse: AcceptChallengeDTO, files?: File[], images?: File[]) => {
  const { data, headers } = await api.post<ApiResponse<AcceptChallengePayload>>(
    '/challenge-accepted/accept-challenge',
    serializeResponse(challengeResponse, files, images)
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const sendChallengeResponse = async (
  challengeResponse: SendChallengeResponseDTO,
  files?: File[],
  images?: File[]
) => {
  const { data, headers } = await api.post<ApiResponse<SendChallengeResponsePayload>>(
    '/challenge-accepted/send-response',
    serializeResponse(challengeResponse, files, images),
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getAllChallengesAcceptedAsAdministrator = async (filters: GetAllChallengesAcceptedFilters | null) => {
  const { data, headers } = await api.get<ApiResponse<GetAllChallengesAcceptedPayload>>(
    '/challenge-accepted/administrator',
    {
      params: filters,
    }
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const getChallengeAcceptedAsAdministrator = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<GetChallengeAcceptedPayload>>(
    `/challenge-accepted/administrator/${id}`
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const acceptChallengeResponse = async (body: AcceptResponseDTO) => {
  const { data, headers } = await api.post<ApiResponse<GetChallengeAcceptedPayload>>(
    '/challenge-accepted/accept',
    body
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const declineChallengeResponse = async (body: DeclineResponseDTO) => {
  const { data, headers } = await api.post<ApiResponse<GetChallengeAcceptedPayload>>(
    '/challenge-accepted/decline',
    body
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};

export const redeemChallengeAcceptedRecompense = async (id: number) => {
  const { data, headers } = await api.get<ApiResponse<RedeemRecompensePayload>>(
    `/challenge-accepted/redeem-recompense/${id}`
  );

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
