import API from '../api/api';
import { mockDataService } from './mockDataService';

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      // Try API first, fallback to mock data
      try {
        const response = await API.get('/tasks');
        return Array.isArray(response.data) ? response.data : [];
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        return mockDataService.tasks;
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Return mock data as fallback
      return mockDataService.tasks;
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      try {
        const response = await API.post('/tasks', taskData);
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(500);
        
        const newTask = {
          _id: mockDataService.generateId(),
          ...taskData,
          createdAt: new Date().toISOString()
        };
        
        mockDataService.tasks.push(newTask);
        return newTask;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      try {
        const response = await API.put(`/tasks/${taskId}`, taskData);
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const taskIndex = mockDataService.tasks.findIndex(t => t._id === taskId);
        if (taskIndex !== -1) {
          mockDataService.tasks[taskIndex] = { ...mockDataService.tasks[taskIndex], ...taskData };
          return mockDataService.tasks[taskIndex];
        }
        throw new Error('Task not found');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      try {
        await API.delete(`/tasks/${taskId}`);
        return true;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const taskIndex = mockDataService.tasks.findIndex(t => t._id === taskId);
        if (taskIndex !== -1) {
          mockDataService.tasks.splice(taskIndex, 1);
          return true;
        }
        throw new Error('Task not found');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Move task to pool
  moveToPool: async (taskId, reason) => {
    try {
      try {
        const response = await API.post(`/tasks/${taskId}/move-to-pool`, { reason });
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const taskIndex = mockDataService.tasks.findIndex(t => t._id === taskId);
        if (taskIndex !== -1) {
          mockDataService.tasks[taskIndex] = {
            ...mockDataService.tasks[taskIndex],
            status: 'pool',
            poolReason: reason,
            movedToPoolAt: new Date().toISOString(),
            assignedTo: null
          };
          return mockDataService.tasks[taskIndex];
        }
        throw new Error('Task not found');
      }
    } catch (error) {
      console.error('Error moving task to pool:', error);
      throw error;
    }
  },

  // Assign task from pool
  assignFromPool: async (taskId, technicianId) => {
    try {
      try {
        const response = await API.post(`/tasks/${taskId}/assign`, { technicianId });
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const taskIndex = mockDataService.tasks.findIndex(t => t._id === taskId);
        if (taskIndex !== -1) {
          mockDataService.tasks[taskIndex] = {
            ...mockDataService.tasks[taskIndex],
            status: 'assigned',
            assignedTo: technicianId,
            assignedAt: new Date().toISOString()
          };
          return mockDataService.tasks[taskIndex];
        }
        throw new Error('Task not found');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  },

  // Complete task
  completeTask: async (taskId, completionData) => {
    try {
      try {
        const response = await API.post(`/tasks/${taskId}/complete`, completionData);
        return response.data;
      } catch (apiError) {
        console.log('API not available, using mock data');
        await mockDataService.delay(300);
        
        const taskIndex = mockDataService.tasks.findIndex(t => t._id === taskId);
        if (taskIndex !== -1) {
          mockDataService.tasks[taskIndex] = {
            ...mockDataService.tasks[taskIndex],
            status: 'completed',
            ...completionData
          };
          return mockDataService.tasks[taskIndex];
        }
        throw new Error('Task not found');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
};