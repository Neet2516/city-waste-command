import { api } from './api';

export const routeService = {
  async getDriverRoute({ driverId, ward, lat, lng }) {
    try {
      const response = await api.get('/route/driver', {
        params: { driverId, ward, lat, lng },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching driver route:', error);
      throw error;
    }
  },
};
