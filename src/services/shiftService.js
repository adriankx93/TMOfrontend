import { SheetData, Technician, Shift, SheetConfig } from '../types/sheets';

// Konfiguracja
const CONFIG: SheetConfig = {
  spreadsheetId: '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  ranges: {
    technicians: 'C7:C23', // TYLKO jedna kolumna z imieniem i nazwiskiem
    dates: 'J5:AN5',       // Pobieramy komórki z wartościami
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

interface GoogleSheetsResponse {
  sheets?: Array<{ properties: { title: string } }>;
  valueRanges?: Array<{ values?: any[][] }>;
}

const _fetchFromSheets = async (url: string, errorPrefix: string): Promise<GoogleSheetsResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    let msg = `${errorPrefix}: ${response.status} ${response.statusText}`;
    try {
      const err = JSON.parse(text);
      if (err.error?.message) msg += ` - ${err.error.message}`;
    } catch {
      msg += ` - ${text}`;
    }
    throw new Error(msg);
  }
  return await response.json();
};

export const sheetsService = {
  testConnection: async () => {
    const sheets = await sheetsService.getAvailableSheets();
    return { success: true, message: 'Połączenie działa', sheets };
  },

  getAvailableSheets: async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}?key=${CONFIG.apiKey}`;
    const data = await _fetchFromSheets(url, 'Nie udało się pobrać arkuszy');
    if (!data.sheets) throw new Error('Brak arkuszy w odpowiedzi API');
    return data.sheets.map(s => s.properties.title.trim());
  },

  getMultipleRanges: async (sheetName: string, ranges: string[]) => {
    const rangesQuery = ranges.map(r => `ranges=${encodeURIComponent(sheetName)}!${r}`).join('&');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values:batchGet?${rangesQuery}&key=${CONFIG.apiKey}`;
    const data = await _fetchFromSheets(url, 'Błąd pobierania zakresów');
    if (!data.valueRanges) throw new Error('Brak danych w odpowiedzi API');
    return data.valueRanges.map(r => r.values || []);
  },

  getCurrentMonthData: async (): Promise<SheetData> => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    const expectedMonthName = CONFIG.monthNames[monthIndex];
    const sheets = await sheetsService.getAvailableSheets();

    let sheetName = sheets.find(name => 
      name.toLowerCase().includes(expectedMonthName) && name.includes(year.toString())
    ) || sheets.find(name => name.toLowerCase().includes(expectedMonthName));

    if (!sheetName) throw new Error(`Nie znaleziono arkusza "${expectedMonthName} ${year}".`);

    const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(sheetName, [
      CONFIG.ranges.technicians,
      CONFIG.ranges.dates,
      CONFIG.ranges.shifts,
    ]);

    if (!datesData.length || !datesData[0]?.length) throw new Error('Brak dat.');
    if (!shiftsData.length) throw new Error('Brak danych zmian.');
    if (!techniciansData.length) throw new Error('Brak danych techników.');

    const finalMonth = CONFIG.monthNames.findIndex(m => sheetName.toLowerCase().includes(m)) || monthIndex;
    const yearMatch = sheetName.match(/20\d{2}/);
    const finalYear = yearMatch ? parseInt(yearMatch[0]) : year;

    const technicians = sheetsService.parseTechnicians(techniciansData);
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, finalYear, finalMonth);

    return {
      month: finalMonth,
      year: finalYear,
      sheetName,
      technicians,
      shifts
    };
  },

  parseTechnicians: (data: any[][]): Technician[] => {
    return data
      .map((row, i) => row?.[0]?.trim())
      .filter(Boolean)
      .map((fullName, i) => ({
        id: i,
        shiftRowIndex: i,
        fullName,
        firstName: fullName,
        lastName: '',
        specialization: '',
      }));
  },

  parseShifts: (technicians, dates, shiftsData, year, monthIndex): Shift[] => {
    return dates
      .map((cell, idx) => {
        const day = parseInt(cell);
        if (isNaN(day) || day < 1 || day > 31) return null;
        const date = new Date(year, monthIndex, day);
        const shift: Shift = {
          date: date.toISOString().split('T')[0],
          dayNumber: day,
          dayTechnicians: [],
          nightTechnicians: [],
          firstShiftTechnicians: [],
          vacationTechnicians: [],
          l4Technicians: [],
        };
        technicians.forEach(tech => {
          const cellVal = (shiftsData[tech.shiftRowIndex]?.[idx] || '').toLowerCase().trim();
          const tokens = cellVal.split(/[\s,]+/).filter(Boolean);
          tokens.forEach(t => {
            switch (t) {
              case CONFIG.shiftCodes.firstShift: shift.firstShiftTechnicians.push(tech.fullName); break;
              case CONFIG.shiftCodes.day: shift.dayTechnicians.push(tech.fullName); break;
              case CONFIG.shiftCodes.night: shift.nightTechnicians.push(tech.fullName); break;
              case CONFIG.shiftCodes.vacation: shift.vacationTechnicians.push(tech.fullName); break;
              case CONFIG.shiftCodes.sickLeave: shift.l4Technicians.push(tech.fullName); break;
            }
          });
        });
        shift.totalWorking = shift.dayTechnicians.length + shift.nightTechnicians.length;
        return shift;
      })
      .filter(Boolean)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  },
};
