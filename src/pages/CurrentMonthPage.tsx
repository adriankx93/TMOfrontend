// --- KONFIGURACJA ---
const CONFIG = {
  spreadsheetId: '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  ranges: {
    technicians: 'C7:C18', // jedna kolumna z imionami
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
  const response = await fetch(url);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${errorMessagePrefix}: ${response.status} ${response.statusText}\n${errorText}`);
  }
  return await response.json();
};

export const sheetsService = {
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
      throw new Error(`Nie znaleziono arkusza "${expectedMonthName} ${year}".`);
    }

    const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
      sheetName,
      [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
    );

    const technicians = sheetsService.parseTechnicians(techniciansData);
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, year, monthIndex);

    return {
      month: monthIndex,
      year,
      sheetName,
      technicians,
      shifts,
      debugRawData: {
        techniciansData,
        datesData,
        shiftsData
      }
    };
  },

  parseTechnicians: (data) => {
    if (!data || !Array.isArray(data)) return [];
    return data
      .map((row, i) => {
        const name = row[0]?.toString().trim();
        if (!name) return null;
        return {
          id: i,
          shiftRowIndex: i,
          firstName: "",
          lastName: "",
          specialization: "",
          fullName: name
        };
      })
      .filter(Boolean);
  },

  parseShifts: (technicians, dates, shiftsData, year, monthIndex) => {
    if (!technicians.length || !dates.length || !shiftsData.length) return [];

    return dates
      .map((cell, idx) => {
        const dayNumber = parseInt(cell);
        if (isNaN(dayNumber)) return null;
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
          const value = (row[idx] || '').toLowerCase().trim();
          const tokens = value.split(/\s|,/).filter(Boolean);

          tokens.forEach(token => {
            if (token === CONFIG.shiftCodes.day) shift.dayTechnicians.push(tech.fullName);
            if (token === CONFIG.shiftCodes.night) shift.nightTechnicians.push(tech.fullName);
            if (token === CONFIG.shiftCodes.firstShift) shift.firstShiftTechnicians.push(tech.fullName);
            if (token === CONFIG.shiftCodes.vacation) shift.vacationTechnicians.push(tech.fullName);
            if (token === CONFIG.shiftCodes.sickLeave) shift.l4Technicians.push(tech.fullName);
          });
        });

        shift.totalWorking =
          shift.dayTechnicians.length +
          shift.nightTechnicians.length +
          shift.firstShiftTechnicians.length;

        return shift;
      })
      .filter(Boolean);
  },
};
