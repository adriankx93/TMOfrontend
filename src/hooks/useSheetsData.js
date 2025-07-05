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
      setError(null);
      
      console.log('useSheetsData: Rozpoczynam pobieranie danych...');
      
      const sheetData = await sheetsService.getAllSheetData();
      
      console.log('useSheetsData: Otrzymane dane:', sheetData);
      
      setData(sheetData);
    } catch (err) {
      console.error('useSheetsData: Błąd:', err);
      setError(err.message || 'Błąd podczas pobierania danych');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Automatyczne odświeżanie co 5 minut
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};