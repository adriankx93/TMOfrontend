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
    return {
      success: true,
      message: 'Połączenie TESTOWE OK',
      sheets: ['Testowy Arkusz']
    };
  },

  getAvailableSheets: async () => {
    return ['Testowy Arkusz'];
  },

  getMultipleRanges: async (sheetName, ranges) => {
    return []; // Nieużywane w teście
  },

  getCurrentMonthData: async () => {
    // 🚀 TU WKLEJAMY TESTOWE DANE:
    const technicians = [
      { id: 0, shiftRowIndex: 0, firstName: 'Jan', lastName: 'Kowalski', specialization: 'Techniczny', fullName: 'Jan Kowalski' },
      { id: 1, shiftRowIndex: 1, firstName: 'Anna', lastName: 'Nowak', specialization: 'Techniczny', fullName: 'Anna Nowak' }
    ];

    const shifts = [
      {
        date: '2025-07-01',
        dayNumber: 1,
        dayTechnicians: ['Jan Kowalski'],
        nightTechnicians: ['Anna Nowak'],
        firstShiftTechnicians: [],
        vacationTechnicians: [],
        l4Technicians: [],
        totalWorking: 2
      },
      {
        date: '2025-07-02',
        dayNumber: 2,
        dayTechnicians: [],
        nightTechnicians: [],
        firstShiftTechnicians: [],
        vacationTechnicians: ['Jan Kowalski'],
        l4Technicians: [],
        totalWorking: 0
      }
    ];

    return {
      month: 6, // lipiec (liczone od 0)
      year: 2025,
      sheetName: 'Testowy Arkusz',
      technicians,
      shifts,
      debugRawData: {
        techniciansData: technicians,
        datesData: ['1', '2'],
        shiftsData: []
      }
    };
  },

  getCurrentMonthShifts: async () => {
    return await sheetsService.getCurrentMonthData();
  },

  parseTechnicians: (data) => [],
  parseShifts: () => []
};
