export interface Technician {
  id: number;
  shiftRowIndex: number;
  firstName: string;
  lastName: string;
  specialization: string;
  fullName: string;
}

export interface Shift {
  date: string;
  dayNumber: number;
  dayTechnicians: string[];
  nightTechnicians: string[];
  firstShiftTechnicians: string[];
  vacationTechnicians: string[];
  l4Technicians: string[];
  totalWorking: number;
}

export interface SheetData {
  month: number;
  year: number;
  sheetName: string;
  technicians: Technician[];
  shifts: Shift[];
  debugRawData: {
    techniciansData: any[][];
    datesData: any[][];
    shiftsData: any[][];
  };
}

export interface SheetConfig {
  spreadsheetId: string;
  apiKey: string;
  ranges: {
    technicians: string;
    dates: string;
    shifts: string;
  };
  monthNames: string[];
  shiftCodes: {
    firstShift: string;
    day: string;
    night: string;
    vacation: string;
    sickLeave: string;
  };
}

export interface MonthStats {
  totalDays: number;
  totalWorkingDays: number;
  avgWorkersPerDay: string;
  allTechnicians: Set<string>;
}

export interface TechnicianWorkload {
  name: string;
  totalShifts: number;
  dayShifts: number;
  nightShifts: number;
  firstShifts: number;
  vacationDays: number;
  sickDays: number;
  specialization: string;
}