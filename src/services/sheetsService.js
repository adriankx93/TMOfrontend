const SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SPREADSHEET_ID = '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ';

export const sheetsService = {
  // Pobierz dane z konkretnego zakresu arkusza
  getSheetRange: async (sheetName, range) => {
    try {
      if (!SHEETS_API_KEY) {
        throw new Error('Brak klucza API Google Sheets. Sprawdź plik .env.');
      }

      const encodedSheetName = encodeURIComponent(sheetName);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedSheetName}!${range}?key=${SHEETS_API_KEY}`;
      console.log('Fetching from URL:', url);

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
        } catch {
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

  // Pobierz dane z całego arkusza
  getSheetData: async (sheetName) => {
    try {
      if (!SHEETS_API_KEY) {
        throw new Error('Brak klucza API Google Sheets.');
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
        } catch {
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

  // Pobierz listę wszystkich arkuszy w dokumencie
  getAvailableSheets: async () => {
    try {
      if (!SHEETS_API_KEY) {
        throw new Error('Brak klucza API Google Sheets.');
      }

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${SHEETS_API_KEY}`;
      console.log('Pobieranie listy arkuszy z URL:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Nie udało się pobrać listy arkuszy: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const sheetNames = data.sheets.map(s => s.properties.title);
      console.log('Dostępne arkusze:', sheetNames);

      return sheetNames;
    } catch (error) {
      console.error('Błąd pobierania listy arkuszy:', error);
      throw error;
    }
  },

  // Pobierz dane aktualnego miesiąca
  getCurrentMonthData: async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // 1-12
      const currentYear = currentDate.getFullYear();

      const monthNames = [
        '', 'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
        'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
      ];

      const expectedSheetName = monthNames[currentMonth];
      console.log(`Oczekiwana nazwa arkusza: ${expectedSheetName}`);

      // Pobierz wszystkie arkusze i dopasuj ignorując wielkość liter
      const allSheets = await sheetsService.getAvailableSheets();
      const sheetName = allSheets.find(
        (name) => name.toLowerCase() === expectedSheetName.toLowerCase()
      );

      if (!sheetName) {
        throw new Error(`Nie znaleziono karty dla miesiąca "${expectedSheetName}". Sprawdź nazwy arkuszy w Google Sheets.`);
      }

      console.log(`Używam arkusza: ${sheetName}`);

      // Pobierz dane
      const techniciansRange = await sheetsService.getSheetRange(sheetName, 'C7:E23');
      console.log('Dane techników:', techniciansRange);

      const datesRange = await sheetsService.getSheetRange(sheetName, 'J3:AM3');
      console.log('Daty:', datesRange);

      const shiftsRange = await sheetsService.getSheetRange(sheetName, 'J7:AM23');
      console.log('Zmiany:', shiftsRange);

      const technicians = sheetsService.parseCurrentMonthTechnicians(techniciansRange);
      const dates = datesRange[0] || [];
      const shifts = sheetsService.parseCurrentMonthShifts(technicians, dates, shiftsRange, currentYear, currentMonth);

      return {
        technicians,
        shifts,
        month: currentMonth - 1,
        year: currentYear
      };
    } catch (error) {
      console.error('Error fetching current month data:', error);
      throw error;
    }
  },

  parseCurrentMonthTechnicians: (techniciansData) => {
    if (!techniciansData || techniciansData.length === 0) return [];
    const technicians = [];

    techniciansData.forEach((row, index) => {
      if (row && row.length >= 2 && row[0] && row[1]) {
        const technician = {
          id: index,
          firstName: row[0]?.toString().trim(),
          lastName: row[1]?.toString().trim(),
          specialization: row[2]?.toString().trim() || 'Techniczny',
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

  parseSheetDate: (dateValue, year, month) => {
    if (!dateValue) return null;

    const dateStr = dateValue.toString().trim();
    const dayOnly = parseInt(dateStr);
    if (!isNaN(dayOnly) && dayOnly >= 1 && dayOnly <= 31) {
      return new Date(year, month - 1, dayOnly);
    }
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
    if (dateStr.includes('-')) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    const excelDate = parseFloat(dateStr);
    if (!isNaN(excelDate) && excelDate > 25000) {
      const excelEpoch = new Date(1899, 11, 30);
      return new Date(excelEpoch.getTime() + excelDate * 24 * 60 * 60 * 1000);
    }
    return null;
  },

  parseCurrentMonthShifts: (technicians, dates, shiftsData, year, month) => {
    if (!technicians || !dates || !shiftsData) return [];
    const shifts = [];

    dates.forEach((dateValue, dateIndex) => {
      const date = sheetsService.parseSheetDate(dateValue, year, month);
      if (!date) {
        console.warn(`Nie można sparsować daty: ${dateValue}`);
        return;
      }
      if (date.getMonth() !== month - 1) return;

      const shift = {
        date: date.toISOString().split('T')[0],
        dayNumber: date.getDate(),
        dayTechnicians: [],
        nightTechnicians: [],
        firstShiftTechnicians: [],
        vacationTechnicians: [],
        l4Technicians: [],
        dayTasks: Math.floor(Math.random() * 10) + 1,
        nightTasks: Math.floor(Math.random() * 5) + 1,
        totalWorking: 0
      };

      technicians.forEach((technician, techIndex) => {
        if (techIndex < shiftsData.length) {
          const shiftValue = (shiftsData[techIndex][dateIndex] || '').toString().trim().toLowerCase();
          if (shiftValue) {
            if (shiftValue.includes('1')) shift.firstShiftTechnicians.push(technician.fullName);
            if (shiftValue.includes('d')) shift.dayTechnicians.push(technician.fullName);
            if (shiftValue.includes('n')) shift.nightTechnicians.push(technician.fullName);
            if (shiftValue.includes('u')) shift.vacationTechnicians.push(technician.fullName);
            if (shiftValue.includes('l4')) shift.l4Technicians.push(technician.fullName);
          }
        }
      });

      shift.totalWorking = shift.dayTechnicians.length + shift.nightTechnicians.length + shift.firstShiftTechnicians.length;
      shifts.push(shift);
    });

    console.log('Przetworzone zmiany:', shifts);
    return shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  getCurrentMonthShifts: async () => {
    try {
      return await sheetsService.getCurrentMonthData();
    } catch (error) {
      console.error('Error fetching current month shifts:', error);
      throw error;
    }
  }
};
