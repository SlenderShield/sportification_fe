export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
  API_VERSION: '/api/v1',
  TIMEOUT: 30000,
  SOCKET_URL: process.env.SOCKET_URL || 'http://localhost:3000',
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};
