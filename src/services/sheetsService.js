// --- KONFIGURACJA ---
const CONFIG = {
  spreadsheetId: '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  ranges: {
    technicians: 'C7:E18', // Zmienione na wiersze 7-18
    dates: 'J32:AN32',
    shifts: 'J7:AN18',     // Zmienione na wiersze 7-18
  },
  monthNames: [
    'styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec',
    'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'
  ],
  shiftCodes: {
    firstShift: '1',
    day: 'd',
    night: 'n',
    vacation: 'u',
    sickLeave: 'l4',
  }
};

const _fetchFromSheets = async (url, errorMessagePrefix) => {
  console.log(`[Sheets API] Wywołuję URL: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `${errorMessagePrefix}: ${response.status} ${response.statusText}`;
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.message) {
        errorMessage += ` - ${errorData.error.message}`;
      }
    } catch {
      errorMessage += ` - ${errorText}`;
    }
    throw new Error(errorMessage);
  }
  return await response.json();
};

export const sheetsService = {
  testConnection: async () => {
    try {
      console.log('[Sheets API] Testowanie połączenia...');
      const sheets = await sheetsService.getAvailableSheets();
      return {
        success: true,
        message: 'Połączenie z Google Sheets działa poprawnie',
        sheets: sheets
      };
    } catch (error) {
      console.error('[Sheets API] Błąd połączenia:', error);
      return {
        success: false,
        message: error.message,
        sheets: []
      };
    }
  },

  getAvailableSheets: async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}?key=${CONFIG.apiKey}`;
    console.log('[Sheets API] Pobieram listę arkuszy...');
    const data = await _fetchFromSheets(url, 'Nie udało się pobrać listy arkuszy');
    const sheetNames = data.sheets.map(s => s.properties.title.trim());
    console.log('[Sheets API] Dostępne arkusze:', sheetNames);
    return sheetNames;
  },

  getMultipleRanges: async (sheetName, ranges) => {
    const encodedSheetName = encodeURIComponent(sheetName);
    const rangesQuery = ranges.map(r => `ranges=${encodedSheetName}!${r}`).join('&');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values:batchGet?${rangesQuery}&key=${CONFIG.apiKey}`;
    console.log(`[Sheets API] Pobieram zakresy: ${ranges.join(', ')} z arkusza "${sheetName}"...`);
    const data = await _fetchFromSheets(url, 'Błąd pobierania zakresów');
    console.log('[Sheets API] Surowa odpowiedź API:', JSON.stringify(data, null, 2));
    return data.valueRanges.map(r => r.values || []);
  },

  getCurrentMonthData: async () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    const expectedMonthName = CONFIG.monthNames[monthIndex];

    console.log(`[Sheets API] Szukam arkusza zawierającego "${expectedMonthName}" i rok ${year}...`);

    const allSheets = await sheetsService.getAvailableSheets();

    let sheetName = allSheets.find(name =>
      name.toLowerCase().includes(expectedMonthName.toLowerCase()) &&
      name.includes(year.toString())
    );

    if (!sheetName) {
      sheetName = allSheets.find(name =>
        name.toLowerCase().includes(expectedMonthName.toLowerCase())
      );
    }

    if (!sheetName) {
      throw new Error(`Nie znaleziono arkusza "${expectedMonthName} ${year}". Sprawdzone arkusze: ${allSheets.join(', ')}`);
    }

    console.log(`[Sheets API] Używam arkusza "${sheetName}"`);

    const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
      sheetName,
      [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
    );

    console.log('[Sheets API] Dane techników (surowe):', techniciansData);
    console.log('[Sheets API] Dane dat (surowe):', datesData);
    console.log('[Sheets API] Dane zmian (surowe):', shiftsData);

    if (!datesData.length || !datesData[0]?.length) {
      throw new Error(`Brak dat w zakresie ${CONFIG.ranges.dates}. Otrzymane dane: ${JSON.stringify(datesData)}`);
    }
    if (!shiftsData.length) {
      throw new Error(`Brak danych zmian w zakresie ${CONFIG.ranges.shifts}. Otrzymane dane: ${JSON.stringify(shiftsData)}`);
    }
    if (!techniciansData.length) {
      throw new Error(`Brak danych techników w zakresie ${CONFIG.ranges.technicians}. Otrzymane dane: ${JSON.stringify(techniciansData)}`);
    }

    const firstCell = datesData[0][0];
    const parsedDate = new Date(firstCell);
    let finalMonthIndex = monthIndex;
    let finalYear = year;
    if (!isNaN(parsedDate.getTime())) {
      finalMonthIndex = parsedDate.getMonth();
      finalYear = parsedDate.getFullYear();
    }

    const technicians = sheetsService.parseTechnicians(techniciansData);
    console.log('[Sheets API] Sparsowani technicy:', technicians);
    
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, finalYear, finalMonthIndex);
    console.log('[Sheets API] Sparsowane zmiany:', shifts);

    return {
      month: finalMonthIndex,
      year: finalYear,
      sheetName,
      technicians,
      shifts
    };
  },

  getCurrentMonthShifts: async () => {
    return await sheetsService.getCurrentMonthData();
  },

  parseTechnicians: (data) => {
    console.log('[Sheets API] Parsowanie techników z danych:', data);
    if (!data || !Array.isArray(data)) {
      console.log('[Sheets API] Brak danych techników lub nieprawidłowy format');
      return [];
    }
    
    const technicians = data
      .map((row, i) => {
        console.log(`[Sheets API] Wiersz ${i}:`, row);
        if (!row || !Array.isArray(row) || !row[0] || !row[1]) {
          console.log(`[Sheets API] Pomijam wiersz ${i} - brak imienia lub nazwiska`);
          return null;
        }
        
        const tech = {
          id: i,
          shiftRowIndex: i,
          firstName: row[0].toString().trim(),
          lastName: row[1].toString().trim(),
          specialization: row[2]?.toString().trim() || 'Techniczny',
          fullName: `${row[0]} ${row[1]}`.trim()
        };
        
        console.log(`[Sheets API] Utworzono technika:`, tech);
        return tech;
      })
      .filter(Boolean);
      
    console.log('[Sheets API] Finalna lista techników:', technicians);
    return technicians;
  },

  parseShifts: (technicians, dates, shiftsData, year, monthIndex) => {
    console.log('[Sheets API] Parsowanie zmian...');
    console.log('[Sheets API] Technicy:', technicians);
    console.log('[Sheets API] Daty:', dates);
    console.log('[Sheets API] Dane zmian:', shiftsData);
    
    if (!technicians.length || !dates.length || !shiftsData.length) {
      console.log('[Sheets API] Brak wymaganych danych do parsowania zmian');
      return [];
    }

    const shifts = dates
      .map((cell, idx) => {
        console.log(`[Sheets API] Przetwarzam datę ${idx}: "${cell}"`);
        
        let dayNumber = parseInt(cell);
        if (isNaN(dayNumber)) {
          const parsed = new Date(cell);
          if (!isNaN(parsed.getTime())) {
            dayNumber = parsed.getDate();
          }
        }

        if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
          console.log(`[Sheets API] Pomijam nieprawidłową datę: "${cell}"`);
          return null;
        }

        const date = new Date(year, monthIndex, dayNumber);

        const shift = {
          date: date.toISOString().split('T')[0],
          dayNumber,
          dayTechnicians: [],
          nightTechnicians: [],
          firstShiftTechnicians: [],
          vacationTechnicians: [],
          l4Technicians: []
        };

        console.log(`[Sheets API] Przetwarzam zmianę dla dnia ${dayNumber}:`);

        technicians.forEach(tech => {
          const row = shiftsData[tech.shiftRowIndex] || [];
          const value = (row[idx] || '').toString().trim().toLowerCase();

          console.log(`[Sheets API] ${tech.fullName} (wiersz ${tech.shiftRowIndex}, kolumna ${idx}): "${value}"`);

          // Sprawdzanie kodów zmian
          if (value.includes(CONFIG.shiftCodes.firstShift)) {
            shift.firstShiftTechnicians.push(tech.fullName);
            console.log(`[Sheets API] ${tech.fullName} -> pierwsza zmiana`);
          }
          if (value.includes(CONFIG.shiftCodes.day)) {
            shift.dayTechnicians.push(tech.fullName);
            console.log(`[Sheets API] ${tech.fullName} -> dzienna`);
          }
          if (value.includes(CONFIG.shiftCodes.night)) {
            shift.nightTechnicians.push(tech.fullName);
            console.log(`[Sheets API] ${tech.fullName} -> nocna`);
          }
          if (value.includes(CONFIG.shiftCodes.vacation)) {
            shift.vacationTechnicians.push(tech.fullName);
            console.log(`[Sheets API] ${tech.fullName} -> urlop`);
          }
          if (value.includes(CONFIG.shiftCodes.sickLeave)) {
            shift.l4Technicians.push(tech.fullName);
            console.log(`[Sheets API] ${tech.fullName} -> L4`);
          }
        });

        shift.totalWorking =
          shift.dayTechnicians.length +
          shift.nightTechnicians.length +
          shift.firstShiftTechnicians.length;

        console.log(`[Sheets API] Zmiana ${dayNumber} - łącznie pracujących: ${shift.totalWorking}`);
        return shift;
      })
      .filter(Boolean)
      .sort((a, b) => a.dayNumber - b.dayNumber);

    console.log(`[Sheets API] Sparsowano ${shifts.length} zmian`);
    return shifts;
  },
};