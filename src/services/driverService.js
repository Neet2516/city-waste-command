import { api } from './api';

export const driverService = {
  async getDrivers() {
    try {
      const response = await api.get('/drivers');
      return response.data;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },
};
