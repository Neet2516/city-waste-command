import { api } from './api';

export const complaintService = {
  async getComplaints() {
    try {
      const response = await api.get('/complaint');
      return response.data;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      throw error;
    }
  },

  async getComplaintsByWard(wardId) {
    try {
      const response = await api.get(`/complaint/ward/${wardId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching complaints for ward ${wardId}:`, error);
      throw error;
    }
  },
};
