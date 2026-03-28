import { api } from './api';

export const statsService = {
  // Get dashboard statistics
  async getStats() {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Get bin statistics grouped by category
  async getCategoryStats() {
    try {
      const response = await api.get('/stats/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw error;
    }
  }
};
