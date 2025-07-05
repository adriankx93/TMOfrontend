const SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ';

export const sheetsService = {
  // Pobierz dane z konkretnego zakresu arkusza
  getSheetRange: async (sheetName, range) => {
    try {
      // Validate API key
      if (!SHEETS_API_KEY) {
        throw new Error('Brak klucza API Google Sheets. Sprawdź plik .env i upewnij się, że VITE_GOOGLE_SHEETS_API_KEY jest ustawiony.');
      }

      // Encode sheet name to handle Polish characters
      const encodedSheetName = encodeURIComponent(sheetName);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedSheetName}!${range}?key=${SHEETS_API_KEY}`;
      
      console.log('Fetching from URL:', url);
      console.log('Sheet name:', sheetName, 'Encoded:', encodedSheetName);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = `Failed to fetch sheet range: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMessage += ` - ${errorData.error.message}`;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the raw text
          errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching sheet range:', error);
      throw new Error(`Błąd pobierania danych z arkusza: ${error.message}`);
    }
  },

  // Pobierz dane z arkusza
  getSheetData: async (sheetName) => {
    try {
      // Validate API key
      if (!SHEETS_API_KEY) {
        throw new Error('Brak klucza API Google Sheets. Sprawdź plik .env i upewnij się, że VITE_GOOGLE_SHEETS_API_KEY jest ustawiony.');
      }

      const encodedSheetName = encodeURIComponent(sheetName);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedSheetName}?key=${SHEETS_API_KEY}`;
      
      console.log('Fetching sheet data from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        let errorMessage = `Failed to fetch sheet data: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            errorMessage += ` - ${errorData.error.message}`;
          }
        } catch (parseError) {
          errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data.values || [];
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw new Error(`Błąd pobierania danych z arkusza: ${error.message}`);
    }
  },

  // Pobierz dane aktualnego miesiąca z konkretnego arkusza
  getCurrentMonthData: async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const currentYear = currentDate.getFullYear();
      
      // Znajdź nazwę arkusza dla aktualnego miesiąca
      const monthNames = [
        '', 'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
      ];
      
      const sheetName = monthNames[currentMonth];
      
      console.log(`Pobieranie danych z arkusza: ${sheetName} (miesiąc: ${currentMonth})`);
      
      // First, try to verify if the sheet exists by getting basic sheet info
      try {
        await sheetsService.getSheetData(sheetName);
      } catch (error) {
        console.error(`Arkusz "${sheetName}" nie istnieje lub nie jest dostępny:`, error);
        throw new Error(`Arkusz "${sheetName}" nie istnieje w dokumencie Google Sheets lub nie masz do niego dostępu. Sprawdź czy arkusz o tej nazwie istnieje i czy dokument jest udostępniony publicznie lub z odpowiednimi uprawnieniami.`);
      }
      
      // Pobierz techników z zakresu C7:E23
      const techniciansRange = await sheetsService.getSheetRange(sheetName, 'C7:E23');
      console.log('Dane techników (C7:E23):', techniciansRange);
      
      // Pobierz daty z wiersza J3:AM3
      const datesRange = await sheetsService.getSheetRange(sheetName, 'J3:AM3');
      console.log('Daty miesiąca (J3:AM3):', datesRange);
      
      // Pobierz zmiany techników z zakresu J7:AM23
      const shiftsRange = await sheetsService.getSheetRange(sheetName, 'J7:AM23');
      console.log('Zmiany techników (J7:AM23):', shiftsRange);
      
      // Przetwórz dane
      const technicians = sheetsService.parseCurrentMonthTechnicians(techniciansRange);
      const dates = datesRange[0] || [];
      const shifts = sheetsService.parseCurrentMonthShifts(technicians, dates, shiftsRange, currentYear, currentMonth);
      
      return {
        technicians,
        shifts,
        month: currentMonth - 1, // 0-11 dla JavaScript Date
        year: currentYear
      };
      
    } catch (error) {
      console.error('Error fetching current month data:', error);
      throw error;
    }
  },

  // Parsuj techników z aktualnego miesiąca
  parseCurrentMonthTechnicians: (techniciansData) => {
    if (!techniciansData || techniciansData.length === 0) return [];
    
    const technicians = [];
    
    techniciansData.forEach((row, index) => {
      if (row && row.length >= 2 && row[0] && row[1]) {
        const technician = {
          id: index,
          firstName: row[0] ? row[0].toString().trim() : '',
          lastName: row[1] ? row[1].toString().trim() : '',
          specialization: row[2] ? row[2].toString().trim() : 'Techniczny',
          fullName: `${row[0]} ${row[1]}`.trim()
        };
        
        if (technician.firstName && technician.lastName) {
          technicians.push(technician);
        }
      }
    });
    
    console.log('Przetworzone dane techników:', technicians);
    return technicians;
  },

  // Parsuj daty z formatu Excel/Google Sheets
  parseSheetDate: (dateValue, year, month) => {
    if (!dateValue) return null;
    
    // Jeśli to już jest liczba (dzień miesiąca)
    if (typeof dateValue === 'number') {
      const day = Math.floor(dateValue);
      if (day >= 1 && day <= 31) {
        return new Date(year, month - 1, day);
      }
    }
    
    // Jeśli to string
    const dateStr = dateValue.toString().trim();
    
    // Sprawdź czy to tylko dzień (np. "1", "15", "31")
    const dayOnly = parseInt(dateStr);
    if (!isNaN(dayOnly) && dayOnly >= 1 && dayOnly <= 31) {
      return new Date(year, month - 1, dayOnly);
    }
    
    // Sprawdź czy to data w formacie DD/MM/YYYY lub DD.MM.YYYY
    if (dateStr.includes('/') || dateStr.includes('.')) {
      const separator = dateStr.includes('/') ? '/' : '.';
      const parts = dateStr.split(separator);
      
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const monthPart = parseInt(parts[1]);
        const yearPart = parseInt(parts[2]);
        
        if (day >= 1 && day <= 31 && monthPart >= 1 && monthPart <= 12) {
          return new Date(yearPart, monthPart - 1, day);
        }
      }
    }
    
    // Sprawdź czy to data w formacie YYYY-MM-DD
    if (dateStr.includes('-')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    
    // Jeśli to data serializowana z Excel (liczba dni od 1900-01-01)
    const excelDate = parseFloat(dateStr);
    if (!isNaN(excelDate) && excelDate > 25000) { // Rozumna wartość dla dat po 1968
      // Excel liczy dni od 1 stycznia 1900, ale ma błąd z rokiem przestępnym 1900
      const excelEpoch = new Date(1899, 11, 30); // 30 grudnia 1899
      const date = new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
      return date;
    }
    
    return null;
  },

  // Parsuj zmiany z aktualnego miesiąca
  parseCurrentMonthShifts: (technicians, dates, shiftsData, year, month) => {
    if (!technicians || !dates || !shiftsData) return [];
    
    const shifts = [];
    
    console.log('Parsowanie zmian - daty:', dates);
    console.log('Parsowanie zmian - dane zmian:', shiftsData);
    
    // Dla każdej daty w wierszu J3:AM3
    dates.forEach((dateValue, dateIndex) => {
      if (!dateValue) return;
      
      // Parsuj datę
      const date = sheetsService.parseSheetDate(dateValue, year, month);
      if (!date) {
        console.warn(`Nie można sparsować daty: ${dateValue}`);
        return;
      }
      
      // Sprawdź czy data należy do aktualnego miesiąca
      if (date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        console.log(`Data ${date.toISOString().split('T')[0]} nie należy do aktualnego miesiąca ${month}/${year}`);
        return;
      }
      
      const dayNumber = date.getDate();
      
      const dayTechnicians = [];
      const nightTechnicians = [];
      const firstShiftTechnicians = [];
      const vacationTechnicians = [];
      const l4Technicians = [];
      
      // Sprawdź każdego technika dla tej daty
      technicians.forEach((technician, techIndex) => {
        if (techIndex < shiftsData.length) {
          const techShifts = shiftsData[techIndex] || [];
          const shiftValue = techShifts[dateIndex] ? techShifts[dateIndex].toString().trim().toLowerCase() : '';
          
          if (shiftValue) {
            switch (shiftValue) {
              case '1':
                firstShiftTechnicians.push(technician.fullName);
                break;
              case 'd':
                dayTechnicians.push(technician.fullName);
                break;
              case 'n':
                nightTechnicians.push(technician.fullName);
                break;
              case 'u':
                vacationTechnicians.push(technician.fullName);
                break;
              case 'l4':
                l4Technicians.push(technician.fullName);
                break;
              default:
                // Sprawdź inne możliwe warianty
                if (shiftValue.includes('1')) {
                  firstShiftTechnicians.push(technician.fullName);
                } else if (shiftValue.includes('d')) {
                  dayTechnicians.push(technician.fullName);
                } else if (shiftValue.includes('n')) {
                  nightTechnicians.push(technician.fullName);
                } else if (shiftValue.includes('u')) {
                  vacationTechnicians.push(technician.fullName);
                } else if (shiftValue.includes('l4')) {
                  l4Technicians.push(technician.fullName);
                }
                break;
            }
          }
        }
      });
      
      // Utwórz obiekt zmiany
      const shift = {
        date: date.toISOString().split('T')[0],
        dayNumber: dayNumber,
        dayTechnicians: [...dayTechnicians, ...firstShiftTechnicians], // Zmiana pierwsza i dzienna razem
        nightTechnicians: nightTechnicians,
        firstShiftTechnicians: firstShiftTechnicians,
        vacationTechnicians: vacationTechnicians,
        l4Technicians: l4Technicians,
        dayTasks: Math.floor(Math.random() * 10) + 1, // Przykładowe zadania - można zastąpić rzeczywistymi danymi
        nightTasks: Math.floor(Math.random() * 5) + 1,
        totalWorking: dayTechnicians.length + nightTechnicians.length + firstShiftTechnicians.length
      };
      
      shifts.push(shift);
    });
    
    console.log('Przetworzone zmiany:', shifts);
    return shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // Parsuj dane techników z arkusza (stara metoda dla kompatybilności)
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

  // Parsuj dane zmian z arkusza (stara metoda dla kompatybilności)
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
            const parts = dateStr.split('-');
            if (parts.length === 3) {
              const first = parseInt(parts[0]);
              if (first > 31) {
                parsedDate = new Date(dateStr);
              } else {
                parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
              }
            }
          } else if (dateStr.includes('.')) {
            const parts = dateStr.split('.');
            if (parts.length === 3) {
              parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
            }
          } else {
            parsedDate = new Date(dateStr);
          }
          
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
        
        if (parsedDate) {
          shifts.push(shift);
        }
      }
    }
    
    return shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  // Pobierz dane tylko z aktualnego miesiąca (nowa metoda)
  getCurrentMonthShifts: async () => {
    try {
      return await sheetsService.getCurrentMonthData();
    } catch (error) {
      console.error('Error fetching current month shifts:', error);
      throw error;
    }
  },

  // Pobierz wszystkie dane z arkusza (stara metoda dla kompatybilności)
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