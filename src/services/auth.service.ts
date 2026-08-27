import { apiRequest, setAuthToken } from './api';

export interface LoginParams {
  identifier: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  username: string;
  name: string;
  password: string;
}

export const authApiService = {
  async login(params: LoginParams) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (res.success && res.data?.tokens?.accessToken) {
      setAuthToken(res.data.tokens.accessToken);
    }
    return res;
  },

  async register(params: RegisterParams) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (res.success && res.data?.tokens?.accessToken) {
      setAuthToken(res.data.tokens.accessToken);
    }
    return res;
  },

  async getCurrentUser() {
    return apiRequest('/auth/me');
  },

  async logout() {
    const res = await apiRequest('/auth/logout', { method: 'POST' });
    setAuthToken(null);
    return res;
  },
};
