import API from '../api/api';

export const reportService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await API.get('/reports/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {};
    }
  },

  // Get task completion report
  getTaskCompletionReport: async (startDate, endDate) => {
    try {
      const response = await API.get('/reports/task-completion', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching task completion report:', error);
      return {};
    }
  },

  // Get technician performance report
  getTechnicianPerformanceReport: async (startDate, endDate) => {
    try {
      const response = await API.get('/reports/technician-performance', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching technician performance report:', error);
      return {};
    }
  },

  // Get shift efficiency report
  getShiftEfficiencyReport: async (startDate, endDate) => {
    try {
      const response = await API.get('/reports/shift-efficiency', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift efficiency report:', error);
      return {};
    }
  }
};