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

// --- OBIEKT KONFIGURACYJNY ---
// Wszystkie "magiczne" wartości w jednym miejscu dla łatwiejszej edycji.
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

// --- PRYWATNA FUNKCJA POMOCNICZA ---
// Jedna funkcja do obsługi wszystkich zapytań fetch, aby uniknąć powtarzania kodu.
const _fetchFromSheets = async (url, errorMessagePrefix = 'Błąd pobierania danych') => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
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
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};


export const sheetsService = {
    /**
     * Pobiera nazwy wszystkich dostępnych kart (arkuszy) w dokumencie.
     */
    getAvailableSheets: async () => {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${SHEETS_API_KEY}`;
        console.log('Pobieranie listy arkuszy...');
        const data = await _fetchFromSheets(url, 'Nie udało się pobrać listy arkuszy');
        const sheetNames = data.sheets.map(s => s.properties.title);
        console.log('Dostępne arkusze:', sheetNames);
        return sheetNames;
    },

    /**
     * Pobiera wiele zakresów danych w jednym, wydajnym zapytaniu API.
     * @param {string} sheetName - Nazwa arkusza.
     * @param {string[]} ranges - Tablica zakresów do pobrania, np. ['A1:B2', 'C5:D8'].
     * @returns {Promise<any[][]>} Tablica tablic z danymi dla każdego zakresu.
     */
    getMultipleRanges: async (sheetName, ranges) => {
        const encodedSheetName = encodeURIComponent(sheetName);
        const rangesQuery = ranges.map(r => `ranges=${encodedSheetName}!${r}`).join('&');
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${rangesQuery}&key=${SHEETS_API_KEY}`;
        
        console.log(`Pobieranie zakresów: ${ranges.join(', ')} z arkusza "${sheetName}"...`);
        const data = await _fetchFromSheets(url, 'Błąd pobierania wielu zakresów');
        return data.valueRanges.map(range => range.values || []);
    },

    /**
     * Główna funkcja pobierająca i przetwarzająca wszystkie dane dla bieżącego miesiąca.
     */
    getCurrentMonthData: async () => {
        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth(); // 0 = styczeń, 1 = luty...
        const currentYear = currentDate.getFullYear();

        const expectedSheetName = CONFIG.monthNames[currentMonthIndex];
        console.log(`Oczekiwana nazwa arkusza: ${expectedSheetName}`);

        const allSheets = await sheetsService.getAvailableSheets();
        const sheetName = allSheets.find(
            name => name.toLowerCase() === expectedSheetName.toLowerCase()
        );

        if (!sheetName) {
            throw new Error(`Nie znaleziono karty dla miesiąca "${expectedSheetName}". Sprawdź nazwy arkuszy.`);
        }
        console.log(`Używam arkusza: ${sheetName}`);
        
        // Jedno zapytanie API do pobrania wszystkich potrzebnych danych
        const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
            sheetName,
            [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
        );
        
        const technicians = sheetsService.parseTechnicians(techniciansData);
        const dates = datesData[0] || [];
        const shifts = sheetsService.parseShifts(technicians, dates, shiftsData, currentYear, currentMonthIndex);

        return {
            technicians,
            shifts,
            month: currentMonthIndex,
            year: currentYear
        };
    },

    /**
     * Przetwarza surowe dane techników na listę obiektów.
     */
    parseTechnicians: (techniciansData) => {
        if (!techniciansData) return [];
        return techniciansData.map((row, index) => {
            if (row?.length < 2 || !row[0] || !row[1]) return null;
            return {
                id: index,
                firstName: row[0].trim(),
                lastName: row[1].trim(),
                specialization: row[2]?.trim() || 'Techniczny',
                fullName: `${row[0]} ${row[1]}`.trim()
            };
        }).filter(Boolean); // Usuwa nulle z tablicy
    },
    
    /**
     * Przetwarza surowe dane o zmianach na gotową strukturę.
     */
    parseShifts: (technicians, dates, shiftsData, year, monthIndex) => {
        if (!technicians.length || !dates.length || !shiftsData.length) return [];
        const shifts = [];

        dates.forEach((dateValue, dateIndex) => {
            const date = new Date(year, monthIndex, parseInt(dateValue));
            if (isNaN(date.getTime()) || date.getMonth() !== monthIndex) return;

            const shift = {
                date: date.toISOString().split('T')[0],
                dayNumber: date.getDate(),
                dayTechnicians: [],
                nightTechnicians: [],
                firstShiftTechnicians: [],
                vacationTechnicians: [],
                l4Technicians: [],
            };

            technicians.forEach((technician, techIndex) => {
                const shiftValue = (shiftsData[techIndex]?.[dateIndex] || '').toLowerCase();
                if (!shiftValue) return;

                if (shiftValue.includes(CONFIG.shiftCodes.firstShift)) shift.firstShiftTechnicians.push(technician.fullName);
                if (shiftValue.includes(CONFIG.shiftCodes.day)) shift.dayTechnicians.push(technician.fullName);
                if (shiftValue.includes(CONFIG.shiftCodes.night)) shift.nightTechnicians.push(technician.fullName);
                if (shiftValue.includes(CONFIG.shiftCodes.vacation)) shift.vacationTechnicians.push(technician.fullName);
                if (shiftValue.includes(CONFIG.shiftCodes.sickLeave)) shift.l4Technicians.push(technician.fullName);
            });
            
            shift.totalWorking = shift.dayTechnicians.length + shift.nightTechnicians.length + shift.firstShiftTechnicians.length;
            shifts.push(shift);
        });

        return shifts.sort((a, b) => a.dayNumber - b.dayNumber);
    },
};
