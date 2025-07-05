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
        throw new Error(`Failed to fetch sheet data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw new Error(`Błąd pobierania danych z arkusza: ${error.message}`);
    }
  },

  // Parsuj dane techników z arkusza
  parseTechniciansData: (rawData) => {
    if (!rawData || rawData.length < 2) return [];
    
    const technicians = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (row.length > 0 && row[0]) {
        const technician = {
          firstName: row[0] || '',
          lastName: row[1] || '',
          specialization: row[2] || 'Techniczny',
          shift: row[3] || 'Dzienna',
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
      if (row.length > 0 && row[0]) {
        // Parsuj datę w różnych formatach
        let parsedDate = null;
        if (row[0]) {
          const dateStr = row[0].toString().trim();
          
          if (dateStr.includes('/')) {
            const parts = dateStr.split('/');
            if (parts.length === 3) {
              // DD/MM/YYYY lub MM/DD/YYYY
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]);
              const year = parseInt(parts[2]);
              
              if (year > 31) {
                parsedDate = new Date(year, month - 1, day);
              } else {
                parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
              }
            }
          } else if (dateStr.includes('-')) {
            // YYYY-MM-DD lub DD-MM-YYYY
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              const first = parseInt(parts[0]);
              if (first > 31) {
                parsedDate = new Date(dateStr); // YYYY-MM-DD
              } else {
                parsedDate = new Date(parts[2], parts[1] - 1, parts[0]); // DD-MM-YYYY
              }
            }
          } else if (dateStr.includes('.')) {
            const parts = dateStr.split('.');
            if (parts.length === 3) {
              parsedDate = new Date(parts[2], parts[1] - 1, parts[0]); // DD.MM.YYYY
            }
          } else {
            // Próbuj bezpośrednio jako datę
            parsedDate = new Date(dateStr);
          }
          
          // Sprawdź czy data jest prawidłowa
          if (parsedDate && isNaN(parsedDate.getTime())) {
            parsedDate = null;
          }
        }

        const shift = {
          date: parsedDate ? parsedDate.toISOString().split('T')[0] : row[0],
          dayTechnicians: row[1] ? row[1].toString().split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
          nightTechnicians: row[2] ? row[2].toString().split(',').map(t => t.trim()).filter(t => t.length > 0) : [],
          dayTasks: parseInt(row[3]) || 0,
          nightTasks: parseInt(row[4]) || 0,
          notes: row[5] || ''
        };
        
        // Dodaj tylko jeśli data jest prawidłowa
        if (parsedDate) {
          shifts.push(shift);
        }
      }
    }
    
    // Sortuj według daty
    return shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // Pobierz dane tylko z aktualnego miesiąca
  getCurrentMonthShifts: async () => {
    try {
      const allData = await sheetsService.getAllSheetData();
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      console.log('Pobrane dane z arkusza:', allData);
      console.log('Aktualny miesiąc:', currentMonth, 'rok:', currentYear);
      
      const currentMonthShifts = allData.shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        const isCurrentMonth = shiftDate.getMonth() === currentMonth && shiftDate.getFullYear() === currentYear;
        
        if (isCurrentMonth) {
          console.log('Znaleziono zmianę z aktualnego miesiąca:', shift);
        }
        
        return isCurrentMonth;
      });

      console.log('Zmiany z aktualnego miesiąca:', currentMonthShifts);

      return {
        technicians: allData.technicians,
        shifts: currentMonthShifts,
        month: currentMonth,
        year: currentYear
      };
    } catch (error) {
      console.error('Error fetching current month data:', error);
      throw error;
    }
  },

  // Pobierz wszystkie dane z arkusza
  getAllSheetData: async () => {
    try {
      console.log('Pobieranie danych z arkusza Google Sheets...');
      
      const techniciansData = await sheetsService.getSheetData('Technicy');
      const shiftsData = await sheetsService.getSheetData('Zmiany');
      
      console.log('Surowe dane techników:', techniciansData);
      console.log('Surowe dane zmian:', shiftsData);
      
      const parsedData = {
        technicians: sheetsService.parseTechniciansData(techniciansData),
        shifts: sheetsService.parseShiftsData(shiftsData)
      };
      
      console.log('Przetworzone dane:', parsedData);
      
      return parsedData;
    } catch (error) {
      console.error('Error fetching all sheet data:', error);
      throw error;
    }
  }
};