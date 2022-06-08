import { ApiResponse, CreateCommentDTO, CreateCommentPayload } from '@sec/common';
import api from '~/config/api';
import { APIError } from '~/error/APIError';

export const createComment = async (comment: CreateCommentDTO) => {
  const { data, headers } = await api.post<ApiResponse<CreateCommentPayload>>('/comment', comment);

  if (data.status === 'SUCCESS' || data.status === 'WARNING') {
    return data;
  } else {
    throw new APIError(data.message, data, headers);
  }
};
