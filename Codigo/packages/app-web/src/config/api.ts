import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('@sec:token')}`,
  },
});

api.interceptors.request.use((config) => {
  if (config?.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      '@sec:token'
    )}`;
  }

  return config;
});

export default api;
