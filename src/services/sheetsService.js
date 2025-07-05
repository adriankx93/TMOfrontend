/*
 * Aby ten kod zadziałał, musisz utworzyć w głównym folderze projektu plik `.env`
 * i umieścić w nim swoje klucze. Jeśli używasz Vite, prefix VITE_ jest wymagany.
 *
 * Plik .env:
 * VITE_SHEETS_API_KEY=TWOJ_KLUCZ_API
 * VITE_SPREADSHEET_ID=TWOJ_ID_ARKUSZA
 */
const SHEETS_API_KEY = import.meta.env.VITE_SHEETS_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;

// --- KONFIGURACJA ---
const CONFIG = {
    ranges: {
        technicians: 'C7:E23',
        dates: 'J3:AM3',
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

// --- FUNKCJA POMOCNICZA ---
const _fetchFromSheets = async (url, errorMessagePrefix = 'Błąd pobierania danych') => {
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
    /**
     * Lista arkuszy w dokumencie.
     */
    getAvailableSheets: async () => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${SHEETS_API_KEY}`;
        const data = await _fetchFromSheets(url, 'Nie udało się pobrać listy arkuszy');
        return data.sheets.map(s => s.properties.title);
    },

    /**
     * Pobiera kilka zakresów w jednym zapytaniu.
     */
    getMultipleRanges: async (sheetName, ranges) => {
        const encodedSheetName = encodeURIComponent(sheetName);
        const rangesQuery = ranges.map(r => `ranges=${encodedSheetName}!${r}`).join('&');
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${rangesQuery}&key=${SHEETS_API_KEY}`;
        const data = await _fetchFromSheets(url, 'Błąd pobierania danych zakresów');
        return data.valueRanges.map(r => r.values || []);
    },

    /**
     * Pobiera i przetwarza wszystkie dane bieżącego miesiąca.
     */
    getCurrentMonthData: async () => {
        const now = new Date();
        const monthIndex = now.getMonth();
        const year = now.getFullYear();
        const expectedSheetName = CONFIG.monthNames[monthIndex];

        const allSheets = await sheetsService.getAvailableSheets();
        const sheetName = allSheets.find(
            name => name.toLowerCase() === expectedSheetName.toLowerCase()
        );
        if (!sheetName) {
            throw new Error(`Brak arkusza "${expectedSheetName}".`);
        }

        const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
            sheetName,
            [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
        );

        const technicians = sheetsService.parseTechnicians(techniciansData);
        const dates = datesData[0] || [];
        const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, year, monthIndex);

        return {
            meta: {
                month: monthIndex,
                year,
                sheetName,
            },
            technicians,
            shifts
        };
    },

    getCurrentMonthShifts: async () => {
        return await sheetsService.getCurrentMonthData();
    },

    /**
     * Tworzy listę techników z ich indeksem w tabeli zmian.
     */
    parseTechnicians: (data) => {
        if (!data) return [];
        return data
            .map((row, i) => {
                if (row?.length < 2 || !row[0] || !row[1]) return null;
                return {
                    id: i,
                    rowIndex: i, // indeks w shiftsData
                    firstName: row[0].trim(),
                    lastName: row[1].trim(),
                    specialization: row[2]?.trim() || 'Techniczny',
                    fullName: `${row[0]} ${row[1]}`.trim()
                };
            })
            .filter(Boolean);
    },

    /**
     * Tworzy listę zmian z przypisaniem pracowników.
     */
    parseShifts: (technicians, dates, shiftsData, year, monthIndex) => {
        if (!technicians.length || !dates.length || !shiftsData.length) return [];

        return dates
            .map((dayCell, dateIdx) => {
                const dayNumber = parseInt(dayCell);
                const date = new Date(year, monthIndex, dayNumber);
                if (isNaN(date.getTime()) || date.getMonth() !== monthIndex) return null;

                const shift = {
                    date: date.toISOString().split('T')[0],
                    dayNumber,
                    shifts: {
                        day: [],
                        night: [],
                        firstShift: [],
                        vacation: [],
                        sickLeave: []
                    },
                    totalWorking: 0
                };

                technicians.forEach((technician) => {
                    const shiftRow = shiftsData[technician.rowIndex] || [];
                    const cell = (shiftRow[dateIdx] || '').toLowerCase();

                    if (cell.includes(CONFIG.shiftCodes.firstShift)) shift.shifts.firstShift.push(technician.fullName);
                    if (cell.includes(CONFIG.shiftCodes.day)) shift.shifts.day.push(technician.fullName);
                    if (cell.includes(CONFIG.shiftCodes.night)) shift.shifts.night.push(technician.fullName);
                    if (cell.includes(CONFIG.shiftCodes.vacation)) shift.shifts.vacation.push(technician.fullName);
                    if (cell.includes(CONFIG.shiftCodes.sickLeave)) shift.shifts.sickLeave.push(technician.fullName);
                });

                shift.totalWorking =
                    shift.shifts.day.length +
                    shift.shifts.firstShift.length +
                    shift.shifts.night.length;

                return shift;
            })
            .filter(Boolean)
            .sort((a, b) => a.dayNumber - b.dayNumber);
    },
};
