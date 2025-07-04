import API from '../api/api';

export const shiftService = {
  // Get current shift info
  getCurrentShift: async () => {
    try {
      const response = await API.get('/shifts/current');
      return response.data;
    } catch (error) {
      console.error('Error fetching current shift:', error);
      return null;
    }
  },

  // Get shift schedule
  getShiftSchedule: async (startDate, endDate) => {
    try {
      const response = await API.get('/shifts/schedule', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift schedule:', error);
      return [];
    }
  },

  // Update shift assignment
  updateShiftAssignment: async (shiftId, assignments) => {
    try {
      const response = await API.put(`/shifts/${shiftId}/assignments`, { assignments });
      return response.data;
    } catch (error) {
      console.error('Error updating shift assignment:', error);
      throw error;
    }
  },

  // Get shift statistics
  getShiftStatistics: async (period = 'week') => {
    try {
      const response = await API.get('/shifts/statistics', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift statistics:', error);
      return {};
    }
  }
};