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

export const exportExplorers = async () => {
  const { data } = await api.get('/reports/export/explorers');

  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement('a');
  link.href = url;

  link.setAttribute('download', 'exploradores.csv');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportChallenges = async () => {
  const { data } = await api.get('/reports/export/challenges');

  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement('a');
  link.href = url;

  link.setAttribute('download', 'desafios.csv');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportRecompenses = async () => {
  const { data } = await api.get('/reports/export/recompenses');

  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement('a');
  link.href = url;

  link.setAttribute('download', 'recompensas.csv');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportChallengesAccepted = async () => {
  const { data } = await api.get('/reports/export/challenges-accepted');

  const url = window.URL.createObjectURL(new Blob([data]));

  const link = document.createElement('a');
  link.href = url;

  link.setAttribute('download', 'desafios-aceitos.csv');

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
