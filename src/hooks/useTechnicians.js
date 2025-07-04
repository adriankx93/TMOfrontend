import { useState, useEffect } from 'react';
import { technicianService } from '../services/technicianService';

export const useTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      const data = await technicianService.getAllTechnicians();
      setTechnicians(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTechnician = async (technicianData) => {
    try {
      const newTechnician = await technicianService.createTechnician(technicianData);
      setTechnicians(prev => [...prev, newTechnician]);
      return newTechnician;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTechnician = async (technicianId, technicianData) => {
    try {
      const updatedTechnician = await technicianService.updateTechnician(technicianId, technicianData);
      setTechnicians(prev => prev.map(tech => 
        tech._id === technicianId ? updatedTechnician : tech
      ));
      return updatedTechnician;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTechnician = async (technicianId) => {
    try {
      await technicianService.deleteTechnician(technicianId);
      setTechnicians(prev => prev.filter(tech => tech._id !== technicianId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateStatus = async (technicianId, status) => {
    try {
      const updatedTechnician = await technicianService.updateStatus(technicianId, status);
      setTechnicians(prev => prev.map(tech => 
        tech._id === technicianId ? updatedTechnician : tech
      ));
      return updatedTechnician;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, []);

  return {
    technicians,
    loading,
    error,
    fetchTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician,
    updateStatus
  };
};