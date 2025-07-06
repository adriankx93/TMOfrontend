import { SheetData, Technician, Shift, SheetConfig } from '../types/sheets';

const CONFIG: SheetConfig = {
  spreadsheetId: '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  ranges: {
    technicians: 'C7:E23',
    startDate: 'J3',            // Dodajemy zakres startowej daty
    dates: 'J4:AN4',
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
  error?: { message: string };
}

const _fetchFromSheets = async (url: string, errorMessagePrefix: string): Promise<GoogleSheetsResponse> => {
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
  testConnection: async (): Promise<{ success: boolean; message: string; sheets: string[] }> => {
    const sheets = await sheetsService.getAvailableSheets();
    return {
      success: true,
      message: 'Połączenie z Google Sheets działa poprawnie',
      sheets
    };
  },

  getAvailableSheets: async (): Promise<string[]> => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}?key=${CONFIG.apiKey}`;
    const data = await _fetchFromSheets(url, 'Nie udało się pobrać listy arkuszy');
    if (!data.sheets) throw new Error('Brak arkuszy w odpowiedzi API');
    return data.sheets.map(s => s.properties.title.trim());
  },

  getMultipleRanges: async (sheetName: string, ranges: string[]): Promise<any[][][]> => {
    const encodedSheetName = encodeURIComponent(sheetName);
    const rangesQuery = ranges.map(r => `ranges=${encodedSheetName}!${r}`).join('&');
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

    const allSheets = await sheetsService.getAvailableSheets();

    let sheetName = allSheets.find(name =>
      name.toLowerCase().includes(expectedMonthName.toLowerCase()) &&
      name.includes(year.toString())
    ) || allSheets.find(name =>
      name.toLowerCase().includes(expectedMonthName.toLowerCase())
    );

    if (!sheetName) {
      throw new Error(`Nie znaleziono arkusza "${expectedMonthName} ${year}". Sprawdzone arkusze: ${allSheets.join(', ')}`);
    }

    const [startDateData, datesData, techniciansData, shiftsData] = await sheetsService.getMultipleRanges(
      sheetName,
      [CONFIG.ranges.startDate, CONFIG.ranges.dates, CONFIG.ranges.technicians, CONFIG.ranges.shifts]
    );

    if (!startDateData.length || !startDateData[0]?.length) {
      throw new Error(`Brak daty startowej w komórce ${CONFIG.ranges.startDate}.`);
    }
    if (!datesData.length || !datesData[0]?.length) {
      throw new Error(`Brak dat w zakresie ${CONFIG.ranges.dates}.`);
    }
    if (!techniciansData.length) {
      throw new Error(`Brak danych techników w zakresie ${CONFIG.ranges.technicians}.`);
    }
    if (!shiftsData.length) {
      throw new Error(`Brak danych zmian w zakresie ${CONFIG.ranges.shifts}.`);
    }

    const baseDate = new Date(startDateData[0][0]);
    const technicians = sheetsService.parseTechnicians(techniciansData);
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, baseDate, dates, shiftsData);

    return {
      month: baseDate.getMonth(),
      year: baseDate.getFullYear(),
      sheetName,
      technicians,
      shifts
    };
  },

  getCurrentMonthShifts: async (): Promise<SheetData> => {
    return await sheetsService.getCurrentMonthData();
  },

  parseTechnicians: (data: any[][]): Technician[] => {
    return data
      .map((row, i) => {
        if (!row || !row[0]) return null;
        return {
          id: i,
          shiftRowIndex: i,
          firstName: '',
          lastName: '',
          specialization: '',
          fullName: row[0].toString().trim()
        };
      })
      .filter((tech): tech is Technician => tech !== null);
  },

  parseShifts: (
    technicians: Technician[],
    baseDate: Date,
    dates: any[],
    shiftsData: any[][]
  ): Shift[] => {
    return dates
      .map((_, idx) => {
        const date = new Date(baseDate);
        date.setDate(baseDate.getDate() + idx);

        const shift: Shift = {
          date: date.toISOString().split('T')[0],
          dayNumber: date.getDate(),
          dayTechnicians: [],
          nightTechnicians: [],
          firstShiftTechnicians: [],
          vacationTechnicians: [],
          l4Technicians: []
        };

        technicians.forEach(tech => {
          const row = shiftsData[tech.shiftRowIndex] || [];
          const rawValue = (row[idx] || '').toString().trim().toLowerCase();
          const tokens = rawValue.split(/[\s,]+/).filter(Boolean);

          tokens.forEach(token => {
            switch (token) {
              case CONFIG.shiftCodes.firstShift:
                shift.firstShiftTechnicians.push(tech.fullName);
                break;
              case CONFIG.shiftCodes.day:
                shift.dayTechnicians.push(tech.fullName);
                break;
              case CONFIG.shiftCodes.night:
                shift.nightTechnicians.push(tech.fullName);
                break;
              case CONFIG.shiftCodes.vacation:
                shift.vacationTechnicians.push(tech.fullName);
                break;
              case CONFIG.shiftCodes.sickLeave:
                shift.l4Technicians.push(tech.fullName);
                break;
            }
          });
        });

        shift.totalWorking =
          shift.dayTechnicians.length +
          shift.nightTechnicians.length +
          shift.firstShiftTechnicians.length;

        return shift;
      })
      .filter((shift): shift is Shift => shift !== null)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  },
};
