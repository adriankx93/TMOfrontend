import API from '../api/api';
import { mockDataService } from './mockDataService';

export const technicianService = {
  // Get all technicians
  getAllTechnicians: async () => {
    try {
      try {
        const response = await API.get('/technicians');
        return Array.isArray(response.data) ? response.data : [];
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        return mockDataService.technicians;
      }
    } catch (error) {
      console.error('Error fetching technicians:', error);
      return mockDataService.technicians;
    }
  },

  // Create new technician
  createTechnician: async (technicianData) => {
    try {
      try {
        const response = await API.post('/technicians', technicianData);
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(500);
        
        const newTechnician = {
          _id: mockDataService.generateId(),
          ...technicianData,
          createdAt: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };
        
        mockDataService.technicians.push(newTechnician);
        return newTechnician;
      }
    } catch (error) {
      console.error('Error creating technician:', error);
      throw error;
    }
  },

  // Update technician
  updateTechnician: async (technicianId, technicianData) => {
    try {
      try {
        const response = await API.put(`/technicians/${technicianId}`, technicianData);
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const techIndex = mockDataService.technicians.findIndex(t => t._id === technicianId);
        if (techIndex !== -1) {
          mockDataService.technicians[techIndex] = { ...mockDataService.technicians[techIndex], ...technicianData };
          return mockDataService.technicians[techIndex];
        }
        throw new Error('Technician not found');
      }
    } catch (error) {
      console.error('Error updating technician:', error);
      throw error;
    }
  },

  // Delete technician
  deleteTechnician: async (technicianId) => {
    try {
      try {
        await API.delete(`/technicians/${technicianId}`);
        return true;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const techIndex = mockDataService.technicians.findIndex(t => t._id === technicianId);
        if (techIndex !== -1) {
          mockDataService.technicians.splice(techIndex, 1);
          return true;
        }
        throw new Error('Technician not found');
      }
    } catch (error) {
      console.error('Error deleting technician:', error);
      throw error;
    }
  },

  // Update technician status
  updateStatus: async (technicianId, status) => {
    try {
      try {
        const response = await API.patch(`/technicians/${technicianId}/status`, { status });
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const techIndex = mockDataService.technicians.findIndex(t => t._id === technicianId);
        if (techIndex !== -1) {
          mockDataService.technicians[techIndex] = {
            ...mockDataService.technicians[techIndex],
            status,
            lastActivity: new Date().toISOString()
          };
          return mockDataService.technicians[techIndex];
        }
        throw new Error('Technician not found');
      }
    } catch (error) {
      console.error('Error updating technician status:', error);
      throw error;
    }
  },

  // Get technician tasks
  getTechnicianTasks: async (technicianId) => {
    try {
      try {
        const response = await API.get(`/technicians/${technicianId}/tasks`);
        return Array.isArray(response.data) ? response.data : [];
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const technicianTasks = mockDataService.tasks.filter(task => task.assignedTo === technicianId);
        return technicianTasks;
      }
    } catch (error) {
      console.error('Error fetching technician tasks:', error);
      return mockDataService.tasks.filter(task => task.assignedTo === technicianId);
    }
  }
};