// Serwis do pobierania danych z Google Sheets
const SHEETS_CONFIG = {
  spreadsheetId: import.meta.env.VITE_SPREADSHEET_ID || '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: import.meta.env.VITE_SHEETS_API_KEY || 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets'
};

const MONTH_NAMES = [
  'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
  'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
];

// Funkcja pomocnicza do wykonywania zapytań do API
const fetchFromSheetsAPI = async (url) => {
  console.log('Pobieranie z URL:', url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Błąd odpowiedzi:', response.status, errorText);
      throw new Error(`Błąd API: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Otrzymane dane:', data);
    return data;
  } catch (error) {
    console.error('Błąd podczas pobierania danych:', error);
    throw error;
  }
};

// Funkcja do pobierania listy arkuszy
const getAvailableSheets = async () => {
  const url = `${SHEETS_CONFIG.baseUrl}/${SHEETS_CONFIG.spreadsheetId}?key=${SHEETS_CONFIG.apiKey}`;
  
  try {
    const data = await fetchFromSheetsAPI(url);
    const sheets = data.sheets?.map(sheet => sheet.properties.title) || [];
    console.log('Dostępne arkusze:', sheets);
    return sheets;
  } catch (error) {
    console.error('Nie można pobrać listy arkuszy:', error);
    return [];
  }
};

// Funkcja do pobierania danych z konkretnego zakresu
const getSheetRange = async (sheetName, range) => {
  const encodedSheetName = encodeURIComponent(sheetName);
  const url = `${SHEETS_CONFIG.baseUrl}/${SHEETS_CONFIG.spreadsheetId}/values/${encodedSheetName}!${range}?key=${SHEETS_CONFIG.apiKey}`;
  
  try {
    const data = await fetchFromSheetsAPI(url);
    return data.values || [];
  } catch (error) {
    console.error(`Błąd pobierania zakresu ${range} z arkusza ${sheetName}:`, error);
    return [];
  }
};

// Funkcja do parsowania danych techników
const parseTechniciansData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    console.warn('Brak danych techników');
    return [];
  }

  return rawData
    .map((row, index) => {
      if (!row || row.length < 2 || !row[0]?.trim() || !row[1]?.trim()) {
        return null;
      }

      return {
        id: `tech_${index}`,
        firstName: row[0].trim(),
        lastName: row[1].trim(),
        specialization: row[2]?.trim() || 'Techniczny',
        fullName: `${row[0].trim()} ${row[1].trim()}`,
        rowIndex: index
      };
    })
    .filter(Boolean);
};

// Funkcja do parsowania dat
const parseDatesData = (rawData, year, month) => {
  if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
    console.warn('Brak danych dat');
    return [];
  }

  const dateRow = rawData[0] || [];
  const dates = [];

  dateRow.forEach((cell, index) => {
    const dayNumber = parseInt(cell);
    if (!isNaN(dayNumber) && dayNumber >= 1 && dayNumber <= 31) {
      try {
        const date = new Date(year, month, dayNumber);
        dates.push({
          dayNumber,
          date: date.toISOString().split('T')[0],
          columnIndex: index
        });
      } catch (error) {
        console.warn(`Nieprawidłowa data: ${dayNumber}/${month + 1}/${year}`);
      }
    }
  });

  return dates.sort((a, b) => a.dayNumber - b.dayNumber);
};

// Funkcja do parsowania zmian
const parseShiftsData = (technicians, dates, rawShiftsData) => {
  if (!technicians.length || !dates.length || !rawShiftsData) {
    console.warn('Brak danych do parsowania zmian');
    return [];
  }

  return dates.map(dateInfo => {
    const shift = {
      date: dateInfo.date,
      dayNumber: dateInfo.dayNumber,
      dayTechnicians: [],
      nightTechnicians: [],
      firstShiftTechnicians: [],
      vacationTechnicians: [],
      l4Technicians: [],
      totalWorking: 0
    };

    technicians.forEach(tech => {
      const techRow = rawShiftsData[tech.rowIndex];
      if (!techRow) return;

      const cellValue = (techRow[dateInfo.columnIndex] || '').toString().toLowerCase().trim();
      
      if (cellValue) {
        // Sprawdź różne typy zmian
        if (cellValue.includes('1')) {
          shift.firstShiftTechnicians.push(tech.fullName);
        }
        if (cellValue.includes('d')) {
          shift.dayTechnicians.push(tech.fullName);
        }
        if (cellValue.includes('n')) {
          shift.nightTechnicians.push(tech.fullName);
        }
        if (cellValue.includes('u')) {
          shift.vacationTechnicians.push(tech.fullName);
        }
        if (cellValue.includes('l4')) {
          shift.l4Technicians.push(tech.fullName);
        }
      }
    });

    // Oblicz łączną liczbę pracujących
    shift.totalWorking = shift.dayTechnicians.length + 
                        shift.nightTechnicians.length + 
                        shift.firstShiftTechnicians.length;

    return shift;
  });
};

// Główna funkcja do pobierania danych aktualnego miesiąca
export const sheetsService = {
  getCurrentMonthShifts: async () => {
    try {
      console.log('Rozpoczynam pobieranie danych aktualnego miesiąca...');
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthName = MONTH_NAMES[currentMonth];
      
      console.log(`Szukam danych dla: ${monthName} ${currentYear}`);

      // Pobierz listę dostępnych arkuszy
      const availableSheets = await getAvailableSheets();
      
      if (availableSheets.length === 0) {
        throw new Error('Nie można pobrać listy arkuszy. Sprawdź klucz API i ID arkusza.');
      }

      // Znajdź arkusz dla aktualnego miesiąca
      let targetSheet = availableSheets.find(sheet => 
        sheet.toLowerCase().includes(monthName.toLowerCase()) && 
        sheet.includes(currentYear.toString())
      );

      if (!targetSheet) {
        targetSheet = availableSheets.find(sheet => 
          sheet.toLowerCase().includes(monthName.toLowerCase())
        );
      }

      if (!targetSheet) {
        throw new Error(`Nie znaleziono arkusza dla miesiąca "${monthName}". Dostępne arkusze: ${availableSheets.join(', ')}`);
      }

      console.log(`Używam arkusza: "${targetSheet}"`);

      // Pobierz dane techników (C7:E18)
      const techniciansData = await getSheetRange(targetSheet, 'C7:E18');
      const technicians = parseTechniciansData(techniciansData);
      
      if (technicians.length === 0) {
        throw new Error('Nie znaleziono danych techników w zakresie C7:E18');
      }

      console.log(`Znaleziono ${technicians.length} techników:`, technicians.map(t => t.fullName));

      // Pobierz daty (sprawdź różne wiersze)
      let datesData = [];
      let datesRange = '';
      
      // Sprawdź różne możliwe lokalizacje dat
      const possibleDateRanges = ['J3:AM3', 'J32:AM32', 'J2:AM2', 'J1:AM1'];
      
      for (const range of possibleDateRanges) {
        console.log(`Sprawdzam daty w zakresie: ${range}`);
        const testData = await getSheetRange(targetSheet, range);
        if (testData && testData.length > 0 && testData[0] && testData[0].some(cell => !isNaN(parseInt(cell)))) {
          datesData = testData;
          datesRange = range;
          console.log(`Znaleziono daty w zakresie: ${range}`);
          break;
        }
      }

      if (datesData.length === 0) {
        throw new Error(`Nie znaleziono dat w żadnym z zakresów: ${possibleDateRanges.join(', ')}`);
      }

      const dates = parseDatesData(datesData, currentYear, currentMonth);
      
      if (dates.length === 0) {
        throw new Error('Nie można sparsować dat z arkusza');
      }

      console.log(`Znaleziono ${dates.length} dni:`, dates.map(d => d.dayNumber));

      // Pobierz dane zmian (J7:AM18)
      const shiftsData = await getSheetRange(targetSheet, 'J7:AM18');
      
      if (shiftsData.length === 0) {
        throw new Error('Nie znaleziono danych zmian w zakresie J7:AM18');
      }

      const shifts = parseShiftsData(technicians, dates, shiftsData);

      console.log(`Sparsowano ${shifts.length} zmian`);

      return {
        month: currentMonth,
        year: currentYear,
        sheetName: targetSheet,
        technicians,
        shifts
      };

    } catch (error) {
      console.error('Błąd podczas pobierania danych z arkusza:', error);
      throw new Error(`Błąd pobierania danych: ${error.message}`);
    }
  },

  // Funkcja testowa do sprawdzenia połączenia
  testConnection: async () => {
    try {
      const sheets = await getAvailableSheets();
      return {
        success: true,
        message: `Połączenie OK. Znaleziono ${sheets.length} arkuszy.`,
        sheets
      };
    } catch (error) {
      return {
        success: false,
        message: `Błąd połączenia: ${error.message}`,
        sheets: []
      };
    }
  }
};