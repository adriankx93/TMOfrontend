import API from '../api/api';

export const technicianService = {
  // Get all technicians
  getAllTechnicians: async () => {
    try {
      const response = await API.get('/technicians');
      // Ensure we always return an array, even if the API response is not an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching technicians:', error);
      return [];
    }
  },

  // Create new technician
  createTechnician: async (technicianData) => {
    try {
      const response = await API.post('/technicians', technicianData);
      return response.data;
    } catch (error) {
      console.error('Error creating technician:', error);
      throw error;
    }
  },

  // Update technician
  updateTechnician: async (technicianId, technicianData) => {
    try {
      const response = await API.put(`/technicians/${technicianId}`, technicianData);
      return response.data;
    } catch (error) {
      console.error('Error updating technician:', error);
      throw error;
    }
  },

  // Delete technician
  deleteTechnician: async (technicianId) => {
    try {
      await API.delete(`/technicians/${technicianId}`);
      return true;
    } catch (error) {
      console.error('Error deleting technician:', error);
      throw error;
    }
  },

  // Update technician status
  updateStatus: async (technicianId, status) => {
    try {
      const response = await API.patch(`/technicians/${technicianId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating technician status:', error);
      throw error;
    }
  },

  // Get technician tasks
  getTechnicianTasks: async (technicianId) => {
    try {
      const response = await API.get(`/technicians/${technicianId}/tasks`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching technician tasks:', error);
      return [];
    }
  }
};