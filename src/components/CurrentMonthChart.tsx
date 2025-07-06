import React, { useState, useEffect } from "react";
import { sheetsService } from "../services/sheetsService";
import { SheetData, MonthStats, TechnicianWorkload } from "../types/sheets";
import StatisticsCards from "./StatisticsCards";
import TechnicianWorkloadComponent from "./TechnicianWorkload";
import DailyScheduleTable from "./DailyScheduleTable";

export default function CurrentMonthChart() {
  const [data, setData] = useState<SheetData>({
    technicians: [],
    shifts: [],
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    sheetName: "",
    debugRawData: {
      techniciansData: [],
      datesData: [],
      shiftsData: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const months = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  useEffect(() => {
    fetchCurrentMonthData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchCurrentMonthData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentMonthData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const monthData = await sheetsService.getCurrentMonthData();
      setData(monthData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Błąd podczas pobierania danych");
    } finally {
      setLoading(false);
    }
  };

  const getMonthStats = (): MonthStats => {
    if (!data.shifts || data.shifts.length === 0) {
      return {
        totalDays: 0,
        totalWorkingDays: 0,
        avgWorkersPerDay: "0",
        allTechnicians: new Set()
      };
    }

    const totalDays = data.shifts.length;
    const totalWorkingDays = data.shifts.filter(s => s.totalWorking > 0).length;

    const allTechnicians = new Set<string>();
    let totalWorkers = 0;

    data.shifts.forEach(shift => {
      [
        ...shift.dayTechnicians,
        ...shift.nightTechnicians
      ].forEach(techName => {
        allTechnicians.add(techName);
        totalWorkers++;
      });
    });

    return {
      totalDays,
      totalWorkingDays,
      avgWorkersPerDay: totalDays > 0 ? (totalWorkers / totalDays).toFixed(1) : "0",
      allTechnicians
    };
  };

  const getTechnicianWorkload = (): TechnicianWorkload[] => {
    if (!data.shifts || data.shifts.length === 0) {
      return [];
    }

    const workloadMap = new Map<string, TechnicianWorkload>();

    // Initialize workload for all technicians
    data.technicians.forEach(tech => {
      workloadMap.set(tech.fullName, {
        name: tech.fullName,
        totalShifts: 0,
        dayShifts: 0,
        nightShifts: 0,
        firstShifts: 0,
        vacationDays: 0,
        sickDays: 0,
        specialization: tech.specialization
      });
    });

    // Count shifts for each technician
    data.shifts.forEach(shift => {
      shift.dayTechnicians.forEach(techName => {
        const workload = workloadMap.get(techName);
        if (workload) {
          workload.dayShifts++;
          workload.totalShifts++;
        }
      });

      shift.nightTechnicians.forEach(techName => {
        const workload = workloadMap.get(techName);
        if (workload) {
          workload.nightShifts++;
          workload.totalShifts++;
        }
      });

      shift.firstShiftTechnicians.forEach(techName => {
        const workload = workloadMap.get(techName);
        if (workload) {
          workload.totalShifts++;
        }
      });

      shift.vacationTechnicians.forEach(techName => {
        const workload = workloadMap.get(techName);
        if (workload) {
          workload.vacationDays++;
        }
      });

      shift.l4Technicians.forEach(techName => {
        const workload = workloadMap.get(techName);
        if (workload) {
          workload.sickDays++;
        }
      });
    });

    return Array.from(workloadMap.values())
      .filter(workload => workload.totalShifts > 0 || workload.vacationDays > 0 || workload.sickDays > 0)
      .sort((a, b) => b.totalShifts - a.totalShifts);
  };

  const stats = getMonthStats();
  const technicianWorkload = getTechnicianWorkload();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Ładowanie danych z arkusza...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-lg font-semibold mb-4">
          Błąd wczytywania danych
        </div>
        <p className="text-slate-600 mb-4">{error}</p>
        <button 
          onClick={fetchCurrentMonthData}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Grafik zmian - {months[data.month]} {data.year}
            </h1>
            <p className="text-blue-100 text-lg mt-1">
              Dane z arkusza <strong>{data.sheetName}</strong>
            </p>
            <div className="flex items-center gap-4 mt-3 text-blue-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm">Połączono z Google Sheets</span>
              </div>
              <div className="text-sm">
                Ostatnia aktualizacja: {new Date().toLocaleTimeString('pl-PL')}
              </div>
            </div>
          </div>
          <button
            onClick={fetchCurrentMonthData}
            className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/20 hover:bg-white/30 transition-all duration-200 flex items-center gap-2"
          >
            <span>🔄</span>
            <span>Odśwież dane</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <StatisticsCards stats={stats} />

      {/* Technician Workload */}
      <TechnicianWorkloadComponent workload={technicianWorkload} />

      {/* Daily Schedule */}
      <DailyScheduleTable shifts={data.shifts} />

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Szybkie akcje</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-all duration-200 text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-semibold text-blue-800">Generuj raport</div>
            <div className="text-sm text-blue-600">Utwórz raport miesięczny</div>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-2xl border border-green-200 transition-all duration-200 text-left">
            <div className="text-2xl mb-2">📧</div>
            <div className="font-semibold text-green-800">Wyślij powiadomienia</div>
            <div className="text-sm text-green-600">Powiadom o zmianach</div>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl border border-purple-200 transition-all duration-200 text-left">
            <div className="text-2xl mb-2">📋</div>
            <div className="font-semibold text-purple-800">Eksportuj dane</div>
            <div className="text-sm text-purple-600">Pobierz jako Excel</div>
          </button>
        </div>
      </div>
    </div>
  );
}