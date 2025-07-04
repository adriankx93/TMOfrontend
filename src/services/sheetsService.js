
const SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = '1gduTrxhu4I7Z8CKcBtxmia3_4-7GopgM';

export const sheetsService = {
  // Pobierz dane z arkusza
  getSheetData: async (sheetName) => {
    try {
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${SHEETS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch sheet data');
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      return [];
    }
  },

  // Parsuj dane techników z arkusza
  parseTechniciansData: (rawData) => {
    if (!rawData || rawData.length < 2) return [];
    
    const headers = rawData[0];
    const technicians = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (row.length > 0) {
        const technician = {
          firstName: row[0] || '',
          lastName: row[1] || '',
          specialization: row[2] || '',
          shift: row[3] || '',
          email: row[4] || '',
          phone: row[5] || '',
          status: row[6] || 'active',
          currentLocation: row[7] || '',
          employeeId: row[8] || ''
        };
        technicians.push(technician);
      }
    }
    
    return technicians;
  },

  // Parsuj dane zmian z arkusza
  parseShiftsData: (rawData) => {
    if (!rawData || rawData.length < 2) return [];
    
    const shifts = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (row.length > 0) {
        const shift = {
          date: row[0] || '',
          dayTechnicians: row[1] ? row[1].split(',').map(t => t.trim()) : [],
          nightTechnicians: row[2] ? row[2].split(',').map(t => t.trim()) : [],
          dayTasks: parseInt(row[3]) || 0,
          nightTasks: parseInt(row[4]) || 0,
          notes: row[5] || ''
        };
        shifts.push(shift);
      }
    }
    
    return shifts;
  },

  // Pobierz wszystkie dane z arkusza
  getAllSheetData: async () => {
    try {
      const techniciansData = await sheetsService.getSheetData('Technicy');
      const shiftsData = await sheetsService.getSheetData('Zmiany');
      
      return {
        technicians: sheetsService.parseTechniciansData(techniciansData),
        shifts: sheetsService.parseShiftsData(shiftsData)
      };
    } catch (error) {
      console.error('Error fetching all sheet data:', error);
      return { technicians: [], shifts: [] };
    }
  }
};
