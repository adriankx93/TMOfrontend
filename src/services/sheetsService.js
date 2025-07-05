// --- KONFIGURACJA ---
const CONFIG = {
  spreadsheetId: '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  ranges: {
    technicians: 'C7:E18',
    dates: 'J32:AN32',
    shifts: 'J7:AN18',
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
    const sheets = await sheetsService.getAvailableSheets();
    return {
      success: true,
      message: 'Połączenie z Google Sheets działa poprawnie',
      sheets
    };
  },

  getAvailableSheets: async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}?key=${CONFIG.apiKey}`;
    const data = await _fetchFromSheets(url, 'Nie udało się pobrać listy arkuszy');
    return data.sheets.map(s => s.properties.title.trim());
  },

  getMultipleRanges: async (sheetName, ranges) => {
    const encodedSheetName = encodeURIComponent(sheetName);
    const rangesQuery = ranges.map(r => `ranges=${encodedSheetName}!${r}`).join('&');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values:batchGet?${rangesQuery}&key=${CONFIG.apiKey}`;
    const data = await _fetchFromSheets(url, 'Błąd pobierania zakresów');
    return data.valueRanges.map(r => r.values || []);
  },

  getCurrentMonthData: async () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    const expectedMonthName = CONFIG.monthNames[monthIndex];

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

    const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
      sheetName,
      [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
    );

    if (!datesData.length || !datesData[0]?.length) {
      throw new Error(`Brak dat w zakresie ${CONFIG.ranges.dates}.`);
    }
    if (!shiftsData.length) {
      throw new Error(`Brak danych zmian w zakresie ${CONFIG.ranges.shifts}.`);
    }
    if (!techniciansData.length) {
      throw new Error(`Brak danych techników w zakresie ${CONFIG.ranges.technicians}.`);
    }

    let finalMonthIndex = monthIndex;
    let finalYear = year;

    const sheetNameLower = sheetName.toLowerCase();
    for (let i = 0; i < CONFIG.monthNames.length; i++) {
      if (sheetNameLower.includes(CONFIG.monthNames[i])) {
        finalMonthIndex = i;
        break;
      }
    }
    const yearMatch = sheetName.match(/20\d{2}/);
    if (yearMatch) {
      finalYear = parseInt(yearMatch[0]);
    }

    const technicians = sheetsService.parseTechnicians(techniciansData);
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, finalYear, finalMonthIndex);

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
    if (!data || !Array.isArray(data)) return [];
    return data
      .map((row, i) => {
        if (!row || !row[0] || !row[1]) return null;
        return {
          id: i,
          shiftRowIndex: i,
          firstName: row[0].toString().trim(),
          lastName: row[1].toString().trim(),
          specialization: row[2]?.toString().trim() || 'Techniczny',
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
          dayTechnicians: [],
          nightTechnicians: [],
          firstShiftTechnicians: [],
          vacationTechnicians: [],
          l4Technicians: []
        };

        technicians.forEach(tech => {
          const row = shiftsData[tech.shiftRowIndex] || [];
          const rawValue = (row[idx] || '').toString().trim().toLowerCase();
          const tokens = rawValue.split(/\s|,/).map(s => s.trim()).filter(Boolean);

          tokens.forEach(token => {
            if (token === CONFIG.shiftCodes.firstShift) {
              shift.firstShiftTechnicians.push(tech.fullName);
            } else if (token === CONFIG.shiftCodes.day) {
              shift.dayTechnicians.push(tech.fullName);
            } else if (token === CONFIG.shiftCodes.night) {
              shift.nightTechnicians.push(tech.fullName);
            } else if (token === CONFIG.shiftCodes.vacation) {
              shift.vacationTechnicians.push(tech.fullName);
            } else if (token === CONFIG.shiftCodes.sickLeave) {
              shift.l4Technicians.push(tech.fullName);
            }
          });
        });

        shift.totalWorking =
          shift.dayTechnicians.length +
          shift.nightTechnicians.length +
          shift.firstShiftTechnicians.length;

        return shift;
      })
      .filter(Boolean)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  },
};
