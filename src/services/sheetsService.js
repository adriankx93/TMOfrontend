// --- KONFIGURACJA ---
const CONFIG = {
  spreadsheetId: '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  ranges: {
    technicians: 'C7:E23',
    dates: 'J32:AN32', // numery dni lub daty
    shifts: 'J7:AN23',
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
    console.log('[Sheets API] Odpowiedź:', data);
    return data.valueRanges.map(r => r.values || []);
  },

  getCurrentMonthData: async () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    const expectedMonthName = CONFIG.monthNames[monthIndex];

    console.log(`[Sheets API] Szukam arkusza zawierającego "${expectedMonthName}" i rok ${year}...`);

    const allSheets = await sheetsService.getAvailableSheets();

    let sheetName;

    // 1) Spróbuj znaleźć arkusz z nazwą miesiąca + rokiem
    sheetName = allSheets.find(name =>
      name.toLowerCase().includes(expectedMonthName.toLowerCase()) &&
      name.includes(year.toString())
    );

    // 2) Jeśli nie ma, spróbuj samego miesiąca
    if (!sheetName) {
      sheetName = allSheets.find(name =>
        name.toLowerCase().includes(expectedMonthName.toLowerCase())
      );
    }

    if (!sheetName) {
      throw new Error(
        `Nie znaleziono arkusza z datami dla "${expectedMonthName} ${year}". Sprawdzone arkusze: ${allSheets.join(", ")}`
      );
    }

    console.log(`[Sheets API] Używam arkusza "${sheetName}"`);

    const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
      sheetName,
      [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
    );

    if (!datesData.length || !datesData[0]?.length) {
      throw new Error(`Brak dat w zakresie ${CONFIG.ranges.dates} w arkuszu "${sheetName}".`);
    }
    if (!shiftsData.length) {
      throw new Error(`Brak danych zmian w zakresie ${CONFIG.ranges.shifts} w arkuszu "${sheetName}".`);
    }

    // Jeśli w datacells są pełne daty (np. 2025-07-01), ustaw month/year na podstawie pierwszej komórki
    const firstCell = datesData[0][0];
    const parsedDate = new Date(firstCell);
    let finalMonthIndex = monthIndex;
    let finalYear = year;
    if (!isNaN(parsedDate.getTime())) {
      finalMonthIndex = parsedDate.getMonth();
      finalYear = parsedDate.getFullYear();
      console.log(`[Sheets API] Data w komórce: ${firstCell}, rozpoznano miesiąc ${CONFIG.monthNames[finalMonthIndex]} ${finalYear}`);
    }

    const technicians = sheetsService.parseTechnicians(techniciansData);
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, finalYear, finalMonthIndex);

    return {
      meta: { month: finalMonthIndex, year: finalYear, sheetName },
      technicians,
      shifts
    };
  },

  getCurrentMonthShifts: async () => {
    return await sheetsService.getCurrentMonthData();
  },

  parseTechnicians: (data) => {
    if (!data) return [];
    return data
      .map((row, i) => {
        if (!row[0] || !row[1]) return null;
        return {
          id: i,
          shiftRowIndex: i,
          firstName: row[0].trim(),
          lastName: row[1].trim(),
          specialization: row[2]?.trim() || 'Techniczny',
          fullName: `${row[0]} ${row[1]}`.trim()
        };
      })
      .filter(Boolean);
  },

  parseShifts: (technicians, dates, shiftsData, year, monthIndex) => {
    if (!technicians.length || !dates.length || !shiftsData.length) return [];

    return dates
      .map((cell, idx) => {
        let dayNumber = parseInt(cell);

        // Jeśli nie liczba, próbuj sparsować jako datę
        if (isNaN(dayNumber)) {
          const parsed = new Date(cell);
          if (!isNaN(parsed.getTime())) {
            dayNumber = parsed.getDate();
          }
        }

        if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) return null;

        const date = new Date(year, monthIndex, dayNumber);

        const shift = {
          date: date.toISOString().split('T')[0],
          dayNumber,
          shifts: {
            day: [],
            night: [],
            firstShift: [],
            vacation: [],
            sickLeave: []
          }
        };

        technicians.forEach(tech => {
          const row = shiftsData[tech.shiftRowIndex] || [];
          const value = (row[idx] || '').toLowerCase();
          if (value.includes(CONFIG.shiftCodes.firstShift)) shift.shifts.firstShift.push(tech.fullName);
          if (value.includes(CONFIG.shiftCodes.day)) shift.shifts.day.push(tech.fullName);
          if (value.includes(CONFIG.shiftCodes.night)) shift.shifts.night.push(tech.fullName);
          if (value.includes(CONFIG.shiftCodes.vacation)) shift.shifts.vacation.push(tech.fullName);
          if (value.includes(CONFIG.shiftCodes.sickLeave)) shift.shifts.sickLeave.push(tech.fullName);
        });

        shift.totalWorking =
          shift.shifts.day.length +
          shift.shifts.night.length +
          shift.shifts.firstShift.length;

        return shift;
      })
      .filter(Boolean)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  },
};
