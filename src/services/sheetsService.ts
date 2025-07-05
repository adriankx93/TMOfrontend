import { SheetData, Technician, Shift, SheetConfig } from '../types/sheets';

// Configuration
const CONFIG: SheetConfig = {
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

interface GoogleSheetsResponse {
  sheets?: Array<{ properties: { title: string } }>;
  valueRanges?: Array<{ values?: any[][] }>;
  error?: { message: string };
}

const _fetchFromSheets = async (url: string, errorMessagePrefix: string): Promise<GoogleSheetsResponse> => {
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
    
    if (!data.sheets) {
      throw new Error('Brak arkuszy w odpowiedzi API');
    }
    
    return data.sheets.map(s => s.properties.title.trim());
  },

  getMultipleRanges: async (sheetName: string, ranges: string[]): Promise<any[][][]> => {
    const encodedSheetName = encodeURIComponent(sheetName);
    const rangesQuery = ranges.map(r => `ranges=${encodedSheetName}!${r}`).join('&');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.spreadsheetId}/values:batchGet?${rangesQuery}&key=${CONFIG.apiKey}`;
    
    const data = await _fetchFromSheets(url, 'Błąd pobierania zakresów');
    
    if (!data.valueRanges) {
      throw new Error('Brak danych w odpowiedzi API');
    }
    
    return data.valueRanges.map(r => r.values || []);
  },

  getCurrentMonthData: async (): Promise<SheetData> => {
    console.log('[sheetsService] Rozpoczynam pobieranie danych dla bieżącego miesiąca...');
    
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    const expectedMonthName = CONFIG.monthNames[monthIndex];

    console.log(`[sheetsService] Szukam arkusza dla: ${expectedMonthName} ${year}`);

    const allSheets = await sheetsService.getAvailableSheets();
    console.log('[sheetsService] Dostępne arkusze:', allSheets);

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

    console.log(`[sheetsService] Używam arkusza: ${sheetName}`);

    const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
      sheetName,
      [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
    );

    console.log('[sheetsService] Surowe dane przed parsowaniem:');
    console.log('techniciansData:', JSON.stringify(techniciansData, null, 2));
    console.log('datesData:', JSON.stringify(datesData, null, 2));
    console.log('shiftsData:', JSON.stringify(shiftsData, null, 2));

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

    // Determine month and year from sheet name
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

    console.log(`[sheetsService] Finalne dane: miesiąc=${finalMonthIndex}, rok=${finalYear}`);

    const technicians = sheetsService.parseTechnicians(techniciansData);
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, finalYear, finalMonthIndex);

    console.log('[sheetsService] Sparsowane dane:');
    console.log('technicians:', technicians);
    console.log('shifts:', shifts.slice(0, 3)); // Show first 3 shifts

    return {
      month: finalMonthIndex,
      year: finalYear,
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

  getCurrentMonthShifts: async (): Promise<SheetData> => {
    return await sheetsService.getCurrentMonthData();
  },

  parseTechnicians: (data: any[][]): Technician[] => {
    console.log('[sheetsService] Parsowanie techników z danych:', data);
    
    if (!data || !Array.isArray(data)) {
      console.warn('[sheetsService] Brak danych techników lub nieprawidłowy format');
      return [];
    }
    
    const technicians = data
      .map((row, i) => {
        if (!row || !row[0] || !row[1]) {
          console.log(`[sheetsService] Pomijam wiersz ${i}: brak imienia lub nazwiska`);
          return null;
        }
        
        const technician: Technician = {
          id: i,
          shiftRowIndex: i,
          firstName: row[0].toString().trim(),
          lastName: row[1].toString().trim(),
          specialization: row[2]?.toString().trim() || 'Techniczny',
          fullName: `${row[0]} ${row[1]}`.trim()
        };
        
        console.log(`[sheetsService] Sparsowany technik ${i}:`, technician);
        return technician;
      })
      .filter((tech): tech is Technician => tech !== null);
    
    console.log(`[sheetsService] Łącznie sparsowano ${technicians.length} techników`);
    return technicians;
  },

  parseShifts: (technicians: Technician[], dates: any[], shiftsData: any[][], year: number, monthIndex: number): Shift[] => {
    console.log('[sheetsService] Parsowanie zmian...');
    console.log('technicians:', technicians.length);
    console.log('dates:', dates);
    console.log('shiftsData rows:', shiftsData.length);
    
    if (!technicians.length || !dates.length || !shiftsData.length) {
      console.warn('[sheetsService] Brak wymaganych danych do parsowania zmian');
      return [];
    }

    const shifts = dates
      .map((cell, idx) => {
        let dayNumber = parseInt(cell);
        
        if (isNaN(dayNumber)) {
          const parsed = new Date(cell);
          if (!isNaN(parsed.getTime())) {
            dayNumber = parsed.getDate();
          }
        }
        
        if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) {
          console.log(`[sheetsService] Pomijam nieprawidłową datę w kolumnie ${idx}: ${cell}`);
          return null;
        }

        const date = new Date(year, monthIndex, dayNumber);

        const shift: Shift = {
          date: date.toISOString().split('T')[0],
          dayNumber,
          dayTechnicians: [],
          nightTechnicians: [],
          firstShiftTechnicians: [],
          vacationTechnicians: [],
          l4Technicians: []
        };

        console.log(`[sheetsService] Przetwarzam dzień ${dayNumber} (kolumna ${idx})`);

        technicians.forEach(tech => {
          const row = shiftsData[tech.shiftRowIndex] || [];
          const rawValue = (row[idx] || '').toString().trim().toLowerCase();
          
          if (rawValue) {
            console.log(`[sheetsService] ${tech.fullName} - dzień ${dayNumber}: "${rawValue}"`);
          }
          
          // Split by space or comma and process each token
          const tokens = rawValue.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);

          tokens.forEach(token => {
            switch (token) {
              case CONFIG.shiftCodes.firstShift:
                shift.firstShiftTechnicians.push(tech.fullName);
                console.log(`[sheetsService] ${tech.fullName} - pierwsza zmiana`);
                break;
              case CONFIG.shiftCodes.day:
                shift.dayTechnicians.push(tech.fullName);
                console.log(`[sheetsService] ${tech.fullName} - dzienna`);
                break;
              case CONFIG.shiftCodes.night:
                shift.nightTechnicians.push(tech.fullName);
                console.log(`[sheetsService] ${tech.fullName} - nocna`);
                break;
              case CONFIG.shiftCodes.vacation:
                shift.vacationTechnicians.push(tech.fullName);
                console.log(`[sheetsService] ${tech.fullName} - urlop`);
                break;
              case CONFIG.shiftCodes.sickLeave:
                shift.l4Technicians.push(tech.fullName);
                console.log(`[sheetsService] ${tech.fullName} - L4`);
                break;
              default:
                if (token) {
                  console.log(`[sheetsService] Nieznany kod zmiany: "${token}" dla ${tech.fullName}`);
                }
            }
          });
        });

        shift.totalWorking =
          shift.dayTechnicians.length +
          shift.nightTechnicians.length +
          shift.firstShiftTechnicians.length;

        console.log(`[sheetsService] Dzień ${dayNumber} - łącznie pracujących: ${shift.totalWorking}`);
        return shift;
      })
      .filter((shift): shift is Shift => shift !== null)
      .sort((a, b) => a.dayNumber - b.dayNumber);

    console.log(`[sheetsService] Sparsowano ${shifts.length} zmian`);
    return shifts;
  },
};