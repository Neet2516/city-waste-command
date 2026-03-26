import { api } from './api';

export const wardService = {
  // Get all wards
  async getWards() {
    try {
      const response = await api.get('/wards');
      return response.data;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw error;
    }
  }
};