import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.debug('[API Request]', config.method, config.url, config.data || '');
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.debug('[API Response]', response.config.url, response.status, response.data);
    return response;
  },
  (error) => {
    console.error('[API Response Error]', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
