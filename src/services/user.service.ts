import { apiRequest } from './api';

export const userApiService = {
  async getUserProfile(usernameOrId: string) {
    return apiRequest(`/users/${usernameOrId}`);
  },

  async updateProfile(data: { name?: string; bio?: string; website?: string; avatar?: string }) {
    return apiRequest('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async toggleFollow(userId: string) {
    return apiRequest(`/users/${userId}/follow`, { method: 'POST' });
  },

  async getFollowers(userId: string) {
    return apiRequest(`/users/${userId}/followers`);
  },

  async getFollowing(userId: string) {
    return apiRequest(`/users/${userId}/following`);
  },
};
