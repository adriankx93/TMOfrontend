import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const moveToPool = async (taskId, reason) => {
    try {
      const updatedTask = await taskService.moveToPool(taskId, reason, {});
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const moveToPoolWithData = async (taskId, reason, additionalData = {}) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.moveToPool(taskId, reason, additionalData);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const moveToPoolWithData = async (taskId, reason, additionalData = {}) => {
    try {
      setLoading(true);
      const updatedTask = await taskService.moveToPool(taskId, reason, additionalData);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignFromPool = async (taskId, technicianId) => {
    try {
      const updatedTask = await taskService.assignFromPool(taskId, technicianId);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeTask = async (taskId, completionData) => {
    try {
      const updatedTask = await taskService.completeTask(taskId, completionData);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    moveToPool,
    moveToPoolWithData,
    moveToPoolWithData,
    assignFromPool,
    completeTask
  };
};