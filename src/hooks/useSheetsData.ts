import { useState, useEffect } from 'react';
import { sheetsService } from '../services/sheetsService';
import { SheetData } from '../types/sheets';

interface UseSheetsDataReturn {
  data: SheetData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useSheetsData = (): UseSheetsDataReturn => {
  const [data, setData] = useState<SheetData>({
    technicians: [],
    shifts: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    sheetName: '',
    debugRawData: {
      techniciansData: [],
      datesData: [],
      shiftsData: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('useSheetsData: Rozpoczynam pobieranie danych...');
      
      const sheetData = await sheetsService.getCurrentMonthData();
      
      console.log('useSheetsData: Otrzymane dane:', sheetData);
      
      setData(sheetData);
    } catch (err) {
      console.error('useSheetsData: Błąd:', err);
      setError(err instanceof Error ? err.message : 'Błąd podczas pobierania danych');
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