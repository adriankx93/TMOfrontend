// Configuration object for sheet ranges and month names
const CONFIG = {
  monthNames: [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ],
  ranges: {
    technicians: 'A:A',
    dates: 'B:B', 
    shifts: 'C:Z'
  }
};

// Main sheets service object
const sheetsService = {
  // Test connection to Google Sheets API
  testConnection: async () => {
    try {
      console.log('[Sheets API] Testing connection...');
      // Placeholder for connection test logic
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      console.error('[Sheets API] Connection test failed:', error);
      throw error;
    }
  },

  // Get all available sheet names
  getAvailableSheets: async () => {
    try {
      console.log('[Sheets API] Fetching available sheets...');
      // Placeholder - return mock sheet names for now
      const currentYear = new Date().getFullYear();
      const currentMonth = CONFIG.monthNames[new Date().getMonth()];
      return [
        `${currentMonth} ${currentYear}`,
        `${CONFIG.monthNames[new Date().getMonth() - 1]} ${currentYear}`,
        'Harmonogram'
      ];
    } catch (error) {
      console.error('[Sheets API] Failed to get available sheets:', error);
      throw error;
    }
  },

  // Get data from multiple ranges
  getMultipleRanges: async (sheetName, ranges) => {
    try {
      console.log(`[Sheets API] Fetching multiple ranges from "${sheetName}":`, ranges);
      // Placeholder - return mock data structure
      return ranges.map(range => ({
        range,
        values: [['Mock Data']]
      }));
    } catch (error) {
      console.error('[Sheets API] Failed to get multiple ranges:', error);
      throw error;
    }
  },

  // Get all data from a specific sheet
  getAllSheetData: async (sheetName) => {
    try {
      console.log(`[Sheets API] Fetching all data from "${sheetName}"`);
      // Placeholder for getting all sheet data
      return {
        values: [['Mock', 'Sheet', 'Data']]
      };
    } catch (error) {
      console.error('[Sheets API] Failed to get sheet data:', error);
      throw error;
    }
  },

  // Get current month data (renamed from getCurrentMonthData to getCurrentMonthShifts)
  getCurrentMonthShifts: async () => {
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
      throw new Error(`Nie znaleziono arkusza "${expectedMonthName} ${year}". Sprawdzone arkusze: ${allSheets.join(", ")}`);
    }

    console.log(`[Sheets API] Używam arkusza "${sheetName}"`);

    const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
      sheetName,
      [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
    );

    console.log("=== TechniciansData ===", JSON.stringify(techniciansData, null, 2));
    console.log("=== DatesData ===", JSON.stringify(datesData, null, 2));
    console.log("=== ShiftsData ===", JSON.stringify(shiftsData, null, 2));

    return {
      month: monthIndex,
      year,
      sheetName,
      raw: {
        techniciansData,
        datesData,
        shiftsData
      }
    };
  }
};

export default sheetsService;