import axios from 'axios';

// const prodURL = '';
// const hmgURL = 'http://localhost:4020';
// const { location } = window;

// export const baseURL =
//   location.hostname === 'localhost' ||
//   location.hostname === '127.0.0.1' ||
//   location.hostname === ''
//     ? hmgURL
//     : prodURL;

const api = axios.create({
  // baseURL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('@sec:token')}`,
  },
});

api.interceptors.request.use((config) => {
  if (config?.headers) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      '@sec:token',
    )}`;
  }

  return config;
});

export default api;
