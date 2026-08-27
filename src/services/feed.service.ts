import { apiRequest } from './api';

export const feedApiService = {
  async getHomeFeed(limit = 10, cursor?: string) {
    const query = new URLSearchParams();
    query.append('limit', String(limit));
    if (cursor) query.append('cursor', cursor);

    return apiRequest(`/feed?${query.toString()}`);
  },

  async toggleLikePost(postId: string) {
    return apiRequest(`/posts/${postId}/like`, { method: 'POST' });
  },

  async toggleSavePost(postId: string) {
    return apiRequest(`/posts/${postId}/save`, { method: 'POST' });
  },

  async getPostComments(postId: string) {
    return apiRequest(`/posts/${postId}/comments`);
  },

  async addComment(postId: string, content: string, parentId?: string) {
    return apiRequest(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    });
  },
};
