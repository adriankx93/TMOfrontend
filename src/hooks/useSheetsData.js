
import { useState, useEffect } from 'react';
import { sheetsService } from '../services/sheetsService';

export const useSheetsData = () => {
  const [data, setData] = useState({
    technicians: [],
    shifts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const sheetData = await sheetsService.getAllSheetData();
      setData(sheetData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
