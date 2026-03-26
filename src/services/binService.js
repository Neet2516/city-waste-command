import { api } from './api';

export const binService = {
  // Get all bins
  async getAllBins() {
    try {
      const response = await api.get('/bins');
      return response.data;
    } catch (error) {
      console.error('Error fetching bins:', error);
      throw error;
    }
  },

  // Get bins by ward
  async getBinsByWard(wardId) {
    try {
      const response = await api.get(`/bins?ward=${wardId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bins for ward ${wardId}:`, error);
      throw error;
    }
  },

  // Update bin status
  async updateBinStatus(binId, status) {
    try {
      const response = await api.patch(`/bins/${binId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating bin ${binId} status to ${status}:`, error);
      throw error;
    }
  }
};