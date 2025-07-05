// --- KONFIGURACJA ---
const CONFIG = {
  spreadsheetId: '1SVXZOpWk949RMxhHULOqxZe9kNJkAVyvXFtUq-5lbjQ',
  apiKey: 'AIzaSyDUv_kAUkinXFE8H1UXGSM-GV-cUeNp8JY',
  ranges: {
    technicians: 'C7:E23',
    dates: 'J3:AM3', // Sprawdzamy daty w tym zakresie
    shifts: 'J7:AM23',
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

  // Sprawdza czy arkusz zawiera daty z aktualnego miesiąca
  checkIfSheetContainsCurrentMonth: async (sheetName, currentMonth, currentYear) => {
    try {
      console.log(`[Sheets API] Sprawdzam arkusz "${sheetName}" dla miesiąca ${currentMonth + 1}/${currentYear}`);
      
      const [datesData] = await sheetsService.getMultipleRanges(sheetName, [CONFIG.ranges.dates]);
      
      if (!datesData || !datesData[0] || !datesData[0].length) {
        console.log(`[Sheets API] Brak dat w arkuszu "${sheetName}"`);
        return false;
      }

      const dates = datesData[0];
      console.log(`[Sheets API] Znalezione daty w arkuszu "${sheetName}":`, dates.slice(0, 5), '...');

      // Sprawdzamy czy którakolwiek z dat należy do aktualnego miesiąca
      for (const dateStr of dates) {
        if (!dateStr || dateStr.trim() === '') continue;
        
        try {
          // Próbujemy różne formaty dat
          let date = null;
          
          // Format DD.MM.YYYY lub DD/MM/YYYY
          if (dateStr.includes('.') || dateStr.includes('/')) {
            const separator = dateStr.includes('.') ? '.' : '/';
            const parts = dateStr.split(separator);
            if (parts.length === 3) {
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]);
              const year = parseInt(parts[2]);
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                date = new Date(year, month - 1, day);
              }
            }
          }
          // Format YYYY-MM-DD
          else if (dateStr.includes('-')) {
            date = new Date(dateStr);
          }
          // Tylko liczba (dzień miesiąca)
          else {
            const day = parseInt(dateStr);
            if (!isNaN(day) && day >= 1 && day <= 31) {
              date = new Date(currentYear, currentMonth, day);
            }
          }

          if (date && !isNaN(date.getTime())) {
            const dateMonth = date.getMonth();
            const dateYear = date.getFullYear();
            
            console.log(`[Sheets API] Sprawdzam datę: ${dateStr} -> ${date.toISOString().split('T')[0]} (miesiąc: ${dateMonth}, rok: ${dateYear})`);
            
            if (dateMonth === currentMonth && dateYear === currentYear) {
              console.log(`[Sheets API] ✅ Arkusz "${sheetName}" zawiera daty z aktualnego miesiąca`);
              return true;
            }
          }
        } catch (error) {
          console.log(`[Sheets API] Błąd parsowania daty "${dateStr}":`, error.message);
          continue;
        }
      }

      console.log(`[Sheets API] ❌ Arkusz "${sheetName}" nie zawiera dat z aktualnego miesiąca`);
      return false;
    } catch (error) {
      console.log(`[Sheets API] Błąd sprawdzania arkusza "${sheetName}":`, error.message);
      return false;
    }
  },

  // Znajduje arkusz z danymi aktualnego miesiąca
  findCurrentMonthSheet: async () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    console.log(`[Sheets API] Szukam arkusza z danymi dla ${CONFIG.monthNames[currentMonth]} ${currentYear}`);
    
    const allSheets = await sheetsService.getAvailableSheets();
    
    for (const sheetName of allSheets) {
      const hasCurrentMonth = await sheetsService.checkIfSheetContainsCurrentMonth(sheetName, currentMonth, currentYear);
      if (hasCurrentMonth) {
        console.log(`[Sheets API] ✅ Znaleziono arkusz z aktualnym miesiącem: "${sheetName}"`);
        return sheetName;
      }
    }
    
    throw new Error(`Nie znaleziono arkusza z datami dla ${CONFIG.monthNames[currentMonth]} ${currentYear}. Sprawdzone arkusze: ${allSheets.join(", ")}`);
  },

  getCurrentMonthData: async () => {
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();

    // Znajdź arkusz zawierający daty aktualnego miesiąca
    const sheetName = await sheetsService.findCurrentMonthSheet();

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

    const technicians = sheetsService.parseTechnicians(techniciansData);
    const dates = datesData[0];
    const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, year, monthIndex);

    return {
      meta: { month: monthIndex, year, sheetName },
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

    console.log(`[Sheets API] Parsowanie zmian dla ${dates.length} dni`);

    return dates
      .map((dateStr, idx) => {
        if (!dateStr || dateStr.trim() === '') return null;

        let date = null;
        let dayNumber = null;

        try {
          // Próbujemy różne formaty dat
          // Format DD.MM.YYYY lub DD/MM/YYYY
          if (dateStr.includes('.') || dateStr.includes('/')) {
            const separator = dateStr.includes('.') ? '.' : '/';
            const parts = dateStr.split(separator);
            if (parts.length === 3) {
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]);
              const year = parseInt(parts[2]);
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                date = new Date(year, month - 1, day);
                dayNumber = day;
              }
            }
          }
          // Format YYYY-MM-DD
          else if (dateStr.includes('-')) {
            date = new Date(dateStr);
            dayNumber = date.getDate();
          }
          // Tylko liczba (dzień miesiąca)
          else {
            dayNumber = parseInt(dateStr);
            if (!isNaN(dayNumber) && dayNumber >= 1 && dayNumber <= 31) {
              date = new Date(year, monthIndex, dayNumber);
            }
          }

          if (!date || isNaN(date.getTime()) || !dayNumber) {
            console.log(`[Sheets API] Nieprawidłowa data: "${dateStr}"`);
            return null;
          }
        } catch (error) {
          console.log(`[Sheets API] Błąd parsowania daty "${dateStr}":`, error.message);
          return null;
        }

        const shift = {
          date: date.toISOString().split('T')[0],
          dayNumber,
          dayTechnicians: [],
          nightTechnicians: [],
          firstShiftTechnicians: [],
          vacationTechnicians: [],
          l4Technicians: [],
          totalWorking: 0
        };

        technicians.forEach(tech => {
          const row = shiftsData[tech.shiftRowIndex] || [];
          const value = (row[idx] || '').toLowerCase().trim();
          
          if (!value) return;

          if (value.includes(CONFIG.shiftCodes.firstShift)) {
            shift.firstShiftTechnicians.push(tech.fullName);
          }
          if (value.includes(CONFIG.shiftCodes.day)) {
            shift.dayTechnicians.push(tech.fullName);
          }
          if (value.includes(CONFIG.shiftCodes.night)) {
            shift.nightTechnicians.push(tech.fullName);
          }
          if (value.includes(CONFIG.shiftCodes.vacation)) {
            shift.vacationTechnicians.push(tech.fullName);
          }
          if (value.includes(CONFIG.shiftCodes.sickLeave)) {
            shift.l4Technicians.push(tech.fullName);
          }
        });

        shift.totalWorking = shift.dayTechnicians.length + shift.nightTechnicians.length + shift.firstShiftTechnicians.length;

        return shift;
      })
      .filter(Boolean)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  },
};