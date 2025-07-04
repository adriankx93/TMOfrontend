import API from '../api/api';

export const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await API.get('/tasks');
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await API.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await API.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Move task to pool
  moveToPool: async (taskId, reason) => {
    try {
      const response = await API.post(`/tasks/${taskId}/move-to-pool`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error moving task to pool:', error);
      throw error;
    }
  },

  // Assign task from pool
  assignFromPool: async (taskId, technicianId) => {
    try {
      const response = await API.post(`/tasks/${taskId}/assign`, { technicianId });
      return response.data;
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  },

  // Complete task
  completeTask: async (taskId, completionData) => {
    try {
      const response = await API.post(`/tasks/${taskId}/complete`, completionData);
      return response.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
};